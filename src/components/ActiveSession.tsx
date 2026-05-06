import type { Task } from '../types'

type Props = {
  task: Task | null
  remainingMs: number
  isRunning: boolean
  sessionXpEarned: number
  xpPerMinute: number
  onTogglePause: () => void
}

function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const hh = Math.floor(s / 3600)
  const mm = Math.floor((s % 3600) / 60)
  const ss = s % 60
  if (hh > 0) {
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export function ActiveSession({
  task,
  remainingMs,
  isRunning,
  sessionXpEarned,
  xpPerMinute,
  onTogglePause,
}: Props) {
  if (!task) {
    return (
      <section className="flex min-h-[220px] flex-col justify-center rounded-2xl border border-dashed border-cyber-border/80 bg-white/65 p-8 text-center shadow-glow">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-slate-600">No active session</p>
        <p className="mt-2 text-sm text-slate-500">Start a task from the queue to begin the countdown.</p>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyber-cyan/30 bg-gradient-to-br from-white via-sky-50/70 to-fuchsia-50/60 p-6 shadow-glow">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.16),_transparent_52%)]" />

      <div className="relative">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-cyber-cyan">Active timer</p>
        <h3 className="mt-2 truncate font-display text-xl font-bold text-slate-800">{task.name}</h3>

        <div className="mt-6 flex flex-col items-center">
          <div
            className={`font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-7xl ${
              remainingMs <= 60_000
                ? 'text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-slate-900'
            }`}
          >
            {formatClock(remainingMs)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            At zero, the session ends — remaining work rolls to the next day.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-cyber-border/80 bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Session XP</p>
            <p className="mt-1 font-mono text-2xl text-cyber-amber">{sessionXpEarned.toFixed(1)}</p>
            <p className="text-xs text-slate-500">{xpPerMinute.toFixed(3)} / min</p>
          </div>
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={onTogglePause}
              className={`w-full rounded-xl px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide transition sm:w-auto ${
                isRunning
                  ? 'border border-cyber-magenta/50 bg-cyber-magenta/10 text-cyber-magenta hover:bg-cyber-magenta/20'
                  : 'border border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20'
              }`}
            >
              {isRunning ? 'Pause' : 'Start / Resume'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
