import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActiveSession } from './components/ActiveSession'
import { AllocationBar } from './components/AllocationBar'
import { DashboardHeader } from './components/DashboardHeader'
import { RankToast } from './components/RankToast'
import { TaskCreateForm } from './components/TaskCreateForm'
import { TaskQueue } from './components/TaskQueue'
import { getDayKey, MINUTES_PER_DAY } from './lib/date'
import { clampEventXp, levelFromTotalXp, titleForLevel } from './lib/gamification'
import { loadState, saveState } from './lib/storage'
import {
  expandSlotsToTasks,
  migrateStaleTasks,
  minutesUsedOnDay,
  nextDayKey,
  planCarryoverSlots,
  xpPerMinute,
} from './lib/tasks'
import { useNow } from './hooks/useNow'
import type { AppState, Task, TimerSlice } from './types'

export default function App() {
  const now = useNow(200)
  const [totalXp, setTotalXp] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTimer, setActiveTimer] = useState<TimerSlice | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const [rankToast, setRankToast] = useState<{ level: number; title: string } | null>(null)
  const lastLevelRef = useRef(1)

  const todayKey = useMemo(() => getDayKey(new Date(now)), [now])

  useEffect(() => {
    const s = loadState()
    if (s) {
      setTotalXp(s.totalXp)
      setTasks(migrateStaleTasks(s.tasks, s.activeTimer?.taskId ?? null))
      setActiveTimer(s.activeTimer)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const state: AppState = { totalXp, tasks, activeTimer }
    saveState(state)
  }, [totalXp, tasks, activeTimer, hydrated])

  useEffect(() => {
    setTasks((prev) => migrateStaleTasks(prev, activeTimer?.taskId ?? null))
  }, [todayKey, activeTimer?.taskId])

  const activeTask = useMemo(
    () => (activeTimer ? tasks.find((t) => t.id === activeTimer.taskId) ?? null : null),
    [tasks, activeTimer],
  )

  const remainingMs = useMemo(() => {
    if (!activeTimer) return 0
    if (activeTimer.deadlineMs !== null) {
      return Math.max(0, activeTimer.deadlineMs - now)
    }
    return activeTimer.pausedRemainingMs
  }, [activeTimer, now])

  const sessionXpEarned = useMemo(() => {
    if (!activeTask || !activeTimer) return 0
    const rate = xpPerMinute(activeTask)
    const elapsedMs = Math.min(
      activeTimer.sessionBudgetMs,
      activeTimer.sessionBudgetMs - remainingMs,
    )
    return (elapsedMs / 60000) * rate
  }, [activeTask, activeTimer, remainingMs])

  const displayXp = totalXp + sessionXpEarned
  const displayLevel = levelFromTotalXp(displayXp)

  useEffect(() => {
    if (!hydrated) {
      lastLevelRef.current = displayLevel
      return
    }
    if (displayLevel > lastLevelRef.current) {
      setRankToast({ level: displayLevel, title: titleForLevel(displayLevel) })
      lastLevelRef.current = displayLevel
    }
  }, [displayLevel, hydrated])

  const usedToday = minutesUsedOnDay(tasks, todayKey)
  const remainingBudget = Math.max(0, MINUTES_PER_DAY - usedToday)

  const finalizeSession = useCallback(
    (task: Task, timer: TimerSlice) => {
      const rate = xpPerMinute(task)
      const sessionCapMs = timer.sessionBudgetMs
      const sessionCapMin = sessionCapMs / 60000
      const xpAdd = sessionCapMin * rate
      const wrem = task.workRemainingMinutes - sessionCapMin

      setTotalXp((x) => x + xpAdd)

      setTasks((prev) => {
        const without = prev.filter((t) => t.id !== task.id)
        if (wrem <= 0.0001) {
          return [...without, { ...task, status: 'completed' as const, workRemainingMinutes: 0 }]
        }
        const startDay = nextDayKey(todayKey)
        const slots = planCarryoverSlots(without, startDay, wrem)
        const created = expandSlotsToTasks(task.name, rate, slots)
        return [...without, ...created]
      })
      setActiveTimer(null)
    },
    [todayKey],
  )

  useEffect(() => {
    if (!activeTimer || !activeTask) return
    if (activeTimer.deadlineMs === null) return
    if (remainingMs > 0) return
    finalizeSession(activeTask, activeTimer)
  }, [activeTimer, activeTask, remainingMs, finalizeSession])

  const togglePause = useCallback(() => {
    if (!activeTimer || !activeTask) return
    setActiveTimer((t) => {
      if (!t) return t
      if (t.deadlineMs !== null) {
        const left = Math.max(0, t.deadlineMs - Date.now())
        return { ...t, deadlineMs: null, pausedRemainingMs: left }
      }
      return { ...t, deadlineMs: Date.now() + t.pausedRemainingMs, pausedRemainingMs: 0 }
    })
  }, [activeTimer, activeTask])

  const startTask = useCallback(
    (id: string) => {
      const target = tasks.find((t) => t.id === id)
      if (!target || target.status !== 'pending') return
      const sessionMinutes = Math.min(target.allocatedMinutes, target.workRemainingMinutes)
      const sessionBudgetMs = sessionMinutes * 60_000
      setTasks((prev) =>
        prev.map((t) => {
          if (t.status === 'active') return { ...t, status: 'pending' as const }
          if (t.id === id) return { ...t, status: 'active' as const }
          return t
        }),
      )
      setActiveTimer({
        taskId: id,
        deadlineMs: Date.now() + sessionBudgetMs,
        pausedRemainingMs: 0,
        sessionBudgetMs,
      })
    },
    [tasks],
  )

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const createTask = useCallback(
    (input: {
      name: string
      allocatedMinutes: number
      rootXpPool: number
      totalWorkMinutes: number
    }) => {
      const W = input.totalWorkMinutes
      const D = input.allocatedMinutes
      if (minutesUsedOnDay(tasks, todayKey) + D > MINUTES_PER_DAY) return

      const t: Task = {
        id: crypto.randomUUID(),
        name: input.name,
        allocatedMinutes: D,
        rootWorkMinutes: W,
        rootXpPool: clampEventXp(input.rootXpPool),
        workRemainingMinutes: W,
        dayKey: todayKey,
        status: 'pending',
      }
      setTasks((prev) => [...prev, t])
    },
    [tasks, todayKey],
  )

  const completed = tasks.filter((t) => t.status === 'completed')

  return (
    <div className="min-h-screen pb-16 pt-10">
      <div className="mx-auto max-w-5xl space-y-8 px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.4em] text-cyber-dim">
              Allocation / 24
            </p>
            <p className="text-sm text-slate-600">
              Local day: <span className="font-mono text-cyber-cyan">{todayKey}</span>
            </p>
          </div>
        </div>

        <DashboardHeader totalXp={displayXp} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <AllocationBar usedMinutes={usedToday} />
            <TaskCreateForm
              disabled={!hydrated}
              remainingBudgetMinutes={remainingBudget}
              onCreate={createTask}
            />
          </div>
          <div className="space-y-6">
            <ActiveSession
              task={activeTask}
              remainingMs={remainingMs}
              isRunning={!!activeTimer && activeTimer.deadlineMs !== null}
              sessionXpEarned={sessionXpEarned}
              xpPerMinute={activeTask ? xpPerMinute(activeTask) : 0}
              onTogglePause={togglePause}
            />
            <TaskQueue
              tasks={tasks}
              activeTaskId={activeTimer?.taskId ?? null}
              onStart={startTask}
              onRemove={removeTask}
            />
          </div>
        </div>

        {completed.length > 0 && (
          <section className="rounded-2xl border border-cyber-border/80 bg-white/70 p-5 shadow-glow backdrop-blur-sm">
            <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-600">
              Cleared objectives
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {completed.slice(-8).map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-100/70 px-3 py-1.5 text-xs text-emerald-700"
                >
                  {t.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {rankToast && (
        <RankToast
          level={rankToast.level}
          title={rankToast.title}
          onDismiss={() => setRankToast(null)}
        />
      )}
    </div>
  )
}
