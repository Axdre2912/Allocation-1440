import { useState } from 'react'
import { MAX_XP_PER_EVENT, clampEventXp } from '../lib/gamification'

type Props = {
  disabled: boolean
  remainingBudgetMinutes: number
  onCreate: (input: {
    name: string
    allocatedMinutes: number
    rootXpPool: number
    totalWorkMinutes: number
  }) => void
}

export function TaskCreateForm({ disabled, remainingBudgetMinutes, onCreate }: Props) {
  const [name, setName] = useState('')
  const [durationHours, setDurationHours] = useState('0')
  const [durationMinutes, setDurationMinutes] = useState('45')
  const [totalXp, setTotalXp] = useState('45')

  const [totalWorkHours, setTotalWorkHours] = useState('')
  const [totalWorkMinutes, setTotalWorkMinutes] = useState('')

  function toWholeMinutes(hoursRaw: string, minutesRaw: string): number {
    const h = Math.max(0, Math.floor(Number(hoursRaw) || 0))
    const m = Math.max(0, Math.floor(Number(minutesRaw) || 0))
    return h * 60 + m
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    const D = Math.max(1, toWholeMinutes(durationHours, durationMinutes))
    const X = clampEventXp(Number(totalXp) || 0)
    const hasCustomWork =
      totalWorkHours.trim() !== '' || totalWorkMinutes.trim() !== ''
    const Wraw = hasCustomWork ? toWholeMinutes(totalWorkHours, totalWorkMinutes) : D
    const W = Math.max(D, Wraw)

    if (!name.trim()) return
    if (D > remainingBudgetMinutes) return

    onCreate({
      name: name.trim(),
      allocatedMinutes: D,
      rootXpPool: X,
      totalWorkMinutes: W,
    })
    setName('')
  }

  const D = Math.max(1, toWholeMinutes(durationHours, durationMinutes))
  const overBudget = D > remainingBudgetMinutes

  return (
    <section className="rounded-2xl border border-cyber-border bg-white/75 p-5 shadow-glow backdrop-blur-sm">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-600">
        New task
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        XP accrues per minute. Timer uses deadline-based sync for accurate runs. Max XP per
        event: {MAX_XP_PER_EVENT.toLocaleString()}.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Task name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Deep work block"
            className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-cyber-cyan/40 placeholder:text-slate-400 focus:border-cyber-cyan/50 focus:ring-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Duration (hours / min)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              placeholder="0 h"
              className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
            />
            <input
              inputMode="numeric"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="45 m"
              className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
            />
          </div>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Total XP
          </span>
          <input
            inputMode="numeric"
            value={totalXp}
            onChange={(e) => setTotalXp(e.target.value)}
            placeholder={`0-${MAX_XP_PER_EVENT}`}
            className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Total work (hours / min){' '}
            <span className="font-normal normal-case text-slate-400">
              — optional; defaults to duration. Use for multi-day carryover.
            </span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              value={totalWorkHours}
              onChange={(e) => setTotalWorkHours(e.target.value)}
              placeholder="h (optional)"
              className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
            />
            <input
              inputMode="numeric"
              value={totalWorkMinutes}
              onChange={(e) => setTotalWorkMinutes(e.target.value)}
              placeholder={`m (default ${D})`}
              className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
            />
          </div>
        </label>

        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
          {overBudget && (
            <p className="text-xs text-rose-400">Exceeds today&apos;s remaining budget.</p>
          )}
          <button
            type="submit"
            disabled={disabled || !name.trim() || overBudget}
            className="ml-auto rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-magenta px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Allocate
          </button>
        </div>
      </form>
    </section>
  )
}
