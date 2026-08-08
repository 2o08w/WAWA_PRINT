import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { DEFAULT_SETTINGS } from '../lib/seed'

export function useSettings() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => ({ ...prev, ...patch }))
    },
    [setSettings],
  )

  const setMonthlyTarget = useCallback(
    (value) => {
      setSettings((prev) => ({ ...prev, monthlyTarget: Number(value) || 0 }))
    },
    [setSettings],
  )

  return { settings, updateSettings, setMonthlyTarget, setSettings }
}
