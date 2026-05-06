import { xpProgressInLevel } from '../lib/gamification'

type Props = {
  totalXp: number
}

export function DashboardHeader({ totalXp }: Props) {
  const { level, title, current, next, pct } = xpProgressInLevel(totalXp)

  return (
    <header className="relative overflow-hidden rounded-2xl border border-cyber-border bg-white/80 p-6 shadow-glow backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyber-magenta/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-cyber-cyan/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Operator status
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-sky-500 via-fuchsia-500 to-violet-500 bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Level <span className="text-cyber-cyan">{level}</span>
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>XP segment</span>
            <span>
              <span className="text-cyber-amber">{Math.floor(current)}</span>
              <span className="text-slate-400"> / </span>
              <span>{next}</span>
              <span className="text-slate-400"> → next level</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-amber transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
