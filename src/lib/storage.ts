import type { AppState } from '../types'

const KEY = 'allocation24:v1'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || typeof parsed.totalXp !== 'number' || !Array.isArray(parsed.tasks)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}
