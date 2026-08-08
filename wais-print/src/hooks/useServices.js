import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { DEFAULT_SERVICES } from '../lib/seed'
import { generateId } from '../utils/id'

export function useServices() {
  const [services, setServices] = useLocalStorage(STORAGE_KEYS.services, DEFAULT_SERVICES)

  const addService = useCallback(
    (service) => {
      const newService = { id: generateId('svc'), ...service }
      setServices((prev) => [newService, ...prev])
      return newService
    },
    [setServices],
  )

  const updateService = useCallback(
    (id, patch) => {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    },
    [setServices],
  )

  const deleteService = useCallback(
    (id) => {
      setServices((prev) => prev.filter((s) => s.id !== id))
    },
    [setServices],
  )

  return { services, addService, updateService, deleteService, setServices }
}
