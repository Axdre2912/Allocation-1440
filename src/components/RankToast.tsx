type Props = {
  title: string
  level: number
  onDismiss: () => void
}

export function RankToast({ title, level, onDismiss }: Props) {
  return (
    <div
      className="pointer-events-auto fixed right-4 top-4 z-50 max-w-sm animate-toastIn rounded-xl border border-cyber-cyan/40 bg-white/90 p-4 shadow-glow backdrop-blur-md"
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-magenta/20 font-display text-lg font-bold text-cyber-cyan">
          ▲
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyber-magenta">
            Rank up
          </p>
          <p className="mt-1 font-display text-lg font-bold text-slate-900">{title}</p>
          <p className="mt-0.5 text-sm text-slate-500">Level {level}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
