import { FormEvent, useState } from 'react'

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
  const [duration, setDuration] = useState('45')
  const [totalXp, setTotalXp] = useState('45')
  const [totalWork, setTotalWork] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const D = Math.max(1, Math.floor(Number(duration) || 0))
    const X = Math.max(0, Number(totalXp) || 0)
    const Wraw = totalWork.trim() === '' ? D : Math.floor(Number(totalWork) || 0)
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

  const D = Math.max(1, Math.floor(Number(duration) || 0))
  const overBudget = D > remainingBudgetMinutes

  return (
    <section className="rounded-2xl border border-cyber-border bg-white/75 p-5 shadow-glow backdrop-blur-sm">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-600">
        New task
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        XP accrues per minute. Timer uses deadline-based sync for accurate runs.
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
            Duration (min)
          </span>
          <input
            inputMode="numeric"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Total XP
          </span>
          <input
            inputMode="numeric"
            value={totalXp}
            onChange={(e) => setTotalXp(e.target.value)}
            className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Total work (min){' '}
            <span className="font-normal normal-case text-slate-400">
              — optional; defaults to duration. Use for multi-day carryover.
            </span>
          </span>
          <input
            inputMode="numeric"
            value={totalWork}
            onChange={(e) => setTotalWork(e.target.value)}
            placeholder={`${D}`}
            className="w-full rounded-xl border border-cyber-border/80 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/40"
          />
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
