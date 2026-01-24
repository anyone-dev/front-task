export const HOURS_PER_YEAR = 365 * 24

export function hoursToYears(hours: number): number {
  return Math.floor(hours / HOURS_PER_YEAR)
}
