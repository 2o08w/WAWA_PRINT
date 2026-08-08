const DAY_MS = 24 * 60 * 60 * 1000

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function toISODate(date) {
  const d = new Date(date)
  return d.toISOString().slice(0, 10)
}

export function formatDateID(dateStr, opts = {}) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export function formatDateTimeID(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getMonthKey(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function currentMonthKey() {
  return getMonthKey(new Date().toISOString())
}

export function isSameDay(a, b) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

export function isWithinLastDays(dateStr, days) {
  const d = new Date(dateStr).getTime()
  const now = Date.now()
  return now - d <= days * DAY_MS && d <= now
}

export function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() === 0 ? 7 : d.getDay() // Monday = 1 ... Sunday = 7
  d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

export function startOfMonth(date = new Date()) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function startOfYear(date = new Date()) {
  const d = new Date(date)
  return new Date(d.getFullYear(), 0, 1)
}

export function filterByRange(items, range, dateKey = 'date') {
  const now = new Date()
  let start
  switch (range) {
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      start = startOfWeek(now)
      break
    case 'month':
      start = startOfMonth(now)
      break
    case 'year':
      start = startOfYear(now)
      break
    default:
      return items
  }
  return items.filter((item) => new Date(item[dateKey]) >= start)
}

export function last7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days
}

export function shortWeekdayID(date) {
  return new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })
}
