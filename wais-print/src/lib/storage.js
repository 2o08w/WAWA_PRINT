// Central localStorage keys used across the app.
export const STORAGE_KEYS = {
  transactions: 'wp_transactions',
  services: 'wp_services',
  customers: 'wp_customers',
  expenses: 'wp_expenses',
  settings: 'wp_settings',
}

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Gagal membaca data "${key}" dari localStorage`, err)
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`Gagal menyimpan data "${key}" ke localStorage`, err)
    return false
  }
}

export function clearAllAppData() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
}

export function exportAllData() {
  const data = {}
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = readStorage(key, null)
  })
  return data
}

export function importAllData(data) {
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined) {
      writeStorage(key, data[name])
    }
  })
}
