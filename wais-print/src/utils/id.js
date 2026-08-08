/**
 * Generate a reasonably unique id without external dependencies.
 * Format: <timestamp base36>-<random base36>
 */
export function generateId(prefix = '') {
  const time = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 9)
  return `${prefix ? prefix + '_' : ''}${time}${rand}`
}
