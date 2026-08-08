const CURRENCY_LOCALES = {
  IDR: { locale: 'id-ID', currency: 'IDR' },
  USD: { locale: 'en-US', currency: 'USD' },
  MYR: { locale: 'ms-MY', currency: 'MYR' },
}

export function formatCurrency(value, currency = 'IDR') {
  const amount = Number(value) || 0
  const cfg = CURRENCY_LOCALES[currency] || CURRENCY_LOCALES.IDR
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${cfg.currency} ${amount.toLocaleString('id-ID')}`
  }
}

export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0)
}

export function formatPercent(value, digits = 0) {
  const num = Number(value) || 0
  return `${num.toFixed(digits)}%`
}

export function clampPercent(value) {
  return Math.max(0, Math.min(100, value))
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}
