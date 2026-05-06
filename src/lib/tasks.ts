import { getDayKey, MINUTES_PER_DAY } from './date'
import type { Task } from '../types'

function newId(): string {
  return crypto.randomUUID()
}

export function minutesUsedOnDay(tasks: Task[], dayKey: string): number {
  return tasks.reduce((sum, t) => (t.dayKey === dayKey ? sum + t.allocatedMinutes : sum), 0)
}

export function xpPerMinute(task: Task): number {
  if (task.rootWorkMinutes <= 0) return 0
  return task.rootXpPool / task.rootWorkMinutes
}

export function nextDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + 1)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** First calendar day starting at `startDay` with enough free minutes (may scan forward). */
export function planCarryoverSlots(
  tasks: Task[],
  startDay: string,
  minutesNeeded: number,
): { dayKey: string; minutes: number }[] {
  const extraByDay = new Map<string, number>()
  const usedOn = (day: string) => minutesUsedOnDay(tasks, day) + (extraByDay.get(day) ?? 0)

  const slots: { dayKey: string; minutes: number }[] = []
  let remaining = minutesNeeded
  let day = startDay
  let guard = 0
  while (remaining > 0 && guard++ < 800) {
    const free = Math.max(0, MINUTES_PER_DAY - usedOn(day))
    if (free === 0) {
      day = nextDayKey(day)
      continue
    }
    const put = Math.min(remaining, free)
    slots.push({ dayKey: day, minutes: put })
    extraByDay.set(day, (extraByDay.get(day) ?? 0) + put)
    remaining -= put
    if (remaining > 0) day = nextDayKey(day)
  }
  return slots
}

export function expandSlotsToTasks(
  name: string,
  rate: number,
  slots: { dayKey: string; minutes: number }[],
): Task[] {
  return slots.map((s) => ({
    id: newId(),
    name,
    allocatedMinutes: s.minutes,
    rootWorkMinutes: s.minutes,
    rootXpPool: rate * s.minutes,
    workRemainingMinutes: s.minutes,
    dayKey: s.dayKey,
    status: 'pending' as const,
  }))
}

/** Moves pending tasks from past days onto future slots (same XP rate). */
export function migrateStaleTasks(tasks: Task[], activeTaskId: string | null): Task[] {
  const today = getDayKey()
  const stale = tasks.filter((t) => t.dayKey < today && t.status === 'pending')
  if (stale.length === 0) return tasks

  let next = tasks.filter((t) => !stale.includes(t))
  for (const s of stale) {
    if (activeTaskId === s.id) continue
    const rate = xpPerMinute(s)
    const slots = planCarryoverSlots(next, today, s.workRemainingMinutes)
    next = [...next, ...expandSlotsToTasks(s.name, rate, slots)]
  }
  return next
}
