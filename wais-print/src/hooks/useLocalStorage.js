import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

/**
 * Generic hook that persists state to localStorage under `key`.
 * Works like useState but automatically syncs to disk.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  // keep in sync if another tab / component changes the same key
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === key) {
        setValue(readStorage(key, initialValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
