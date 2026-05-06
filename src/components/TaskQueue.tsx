import type { Task } from '../types'

type Props = {
  tasks: Task[]
  activeTaskId: string | null
  onStart: (id: string) => void
  onRemove: (id: string) => void
}

export function TaskQueue({ tasks, activeTaskId, onRemove, onStart }: Props) {
  const pending = tasks.filter((t) => t.status === 'pending')

  return (
    <section className="rounded-2xl border border-cyber-border bg-white/75 p-5 shadow-glow backdrop-blur-sm">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-600">Queue</h2>
      <p className="mt-1 text-xs text-slate-500">Pending tasks for this cycle.</p>

      {pending.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">Empty — allocate time above.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {pending.map((t) => {
            const isLocked = activeTaskId !== null && activeTaskId !== t.id
            return (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyber-border/70 bg-white/85 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{t.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-500">
                    {t.allocatedMinutes} min reserved · {t.workRemainingMinutes} min work left · pool{' '}
                    {t.rootXpPool.toFixed(0)} / {t.rootWorkMinutes} min
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onStart(t.id)}
                    className="rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyber-cyan hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    disabled={activeTaskId === t.id}
                    onClick={() => onRemove(t.id)}
                    className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
