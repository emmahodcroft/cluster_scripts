/** Returns an array containing only every n-th element of the original array */
export function everyNth<T>(arr: T[], every: number) {
  return arr.filter((_0, index) => index % every === 0)
}

/** Returns every n-th tick depending on available width and tick width */
export function adjustTicks(ticks: number[], availableWidth: number, tickWidth: number) {
  const tickCountDesired = Math.round(availableWidth / tickWidth)
  const interval = Math.ceil(ticks.length / tickCountDesired)
  return everyNth(ticks, interval)
}
