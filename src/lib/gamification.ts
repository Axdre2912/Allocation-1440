export const TITLES: { minLevel: number; name: string }[] = [
  { minLevel: 1, name: 'Novice' },
  { minLevel: 2, name: 'Initiate' },
  { minLevel: 4, name: 'Apprentice' },
  { minLevel: 7, name: 'Warrior' },
  { minLevel: 11, name: 'Vanguard' },
  { minLevel: 16, name: 'Knight' },
  { minLevel: 21, name: 'Master' },
  { minLevel: 31, name: 'Grandmaster' },
  { minLevel: 41, name: 'Legend' },
  { minLevel: 51, name: 'Mythic' },
  { minLevel: 61, name: 'Divine I' },
  { minLevel: 71, name: 'Celestial' },
  { minLevel: 81, name: 'Cosmic' },
  { minLevel: 91, name: 'Eternal' },
  { minLevel: 101, name: 'Transcendent' },
  { minLevel: 111, name: 'Ultimate' },
  { minLevel: 121, name: 'Godlike' },
  { minLevel: 131, name: 'Divine II' },
  { minLevel: 141, name: 'Divine III' },
  { minLevel: 151, name: 'Divine IV' },
  { minLevel: 161, name: 'Divine V' },
  { minLevel: 171, name: 'Divine VI' },
  { minLevel: 181, name: 'Divine VII' },
  { minLevel: 191, name: 'Divine VIII' },
  { minLevel: 201, name: 'Divine IX' },
  { minLevel: 211, name: 'Divine X' },
]

/** Level = floor(sqrt(Total_XP) / 5) + 1 */
export function levelFromTotalXp(totalXp: number): number {
  if (totalXp < 0) return 1
  return Math.floor(Math.sqrt(totalXp) / 5) + 1
}

export function titleForLevel(level: number): string {
  let name = TITLES[0].name
  for (const t of TITLES) {
    if (level >= t.minLevel) name = t.name
  }
  return name
}

/** Minimum total XP required to reach this level (level 1 starts at 0). */
export function xpAtLevelStart(level: number): number {
  if (level <= 1) return 0
  const k = level - 1
  return 25 * k * k
}

/** Total XP needed to reach the next level (exclusive upper bound for current). */
export function xpAtNextLevel(level: number): number {
  return 25 * level * level
}

export function xpProgressInLevel(totalXp: number): {
  level: number
  title: string
  current: number
  next: number
  pct: number
} {
  const level = levelFromTotalXp(totalXp)
  const title = titleForLevel(level)
  const start = xpAtLevelStart(level)
  const next = xpAtNextLevel(level)
  const span = Math.max(1, next - start)
  const current = totalXp - start
  const pct = Math.min(100, Math.max(0, (current / span) * 100))
  return { level, title, current, next, pct }
}
