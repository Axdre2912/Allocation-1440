import { MINUTES_PER_DAY } from '../lib/date'

type Props = {
  usedMinutes: number
}

export function AllocationBar({ usedMinutes }: Props) {
  const pct = Math.min(100, (usedMinutes / MINUTES_PER_DAY) * 100)
  const remaining = Math.max(0, MINUTES_PER_DAY - usedMinutes)

  return (
    <section className="rounded-2xl border border-cyber-border bg-white/75 p-5 shadow-glow backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-600">
            Daily allocation
          </h2>
          <p className="text-xs text-slate-500">Hard cap 24:00 — no extensions</p>
        </div>
        <div className="text-right font-mono text-sm">
          <span className="text-cyber-cyan">{usedMinutes}</span>
          <span className="text-slate-400"> / </span>
          <span className="text-slate-700">{MINUTES_PER_DAY}</span>
          <span className="ml-2 text-xs text-slate-500">min</span>
        </div>
      </div>

      <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-200 ring-1 ring-inset ring-slate-300/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 via-cyber-cyan/90 to-cyber-magenta/80 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        Unallocated: <span className="font-mono text-slate-700">{remaining} min</span>
      </p>
    </section>
  )
}
