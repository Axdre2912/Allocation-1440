export type TaskStatus = 'pending' | 'active' | 'completed'

export type Task = {
  id: string
  name: string
  /** Minutes reserved on dayKey (daily budget) */
  allocatedMinutes: number
  /** Original scope for XP rate: rootXpPool / rootWorkMinutes */
  rootWorkMinutes: number
  rootXpPool: number
  /** Remaining work for this objective */
  workRemainingMinutes: number
  /** Which calendar day this allocation row bills against */
  dayKey: string
  status: TaskStatus
}

export type TimerSlice = {
  taskId: string
  /** While running, wall-clock deadline */
  deadlineMs: number | null
  /** While paused */
  pausedRemainingMs: number
  /** min(allocated, workRemaining) at session start */
  sessionBudgetMs: number
}

export type AppState = {
  totalXp: number
  tasks: Task[]
  activeTimer: TimerSlice | null
}
