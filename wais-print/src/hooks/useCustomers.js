import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { generateId } from '../utils/id'

export function useCustomers() {
  const [customers, setCustomers] = useLocalStorage(STORAGE_KEYS.customers, [])

  const addCustomer = useCallback(
    (customer) => {
      const newCustomer = {
        id: generateId('cust'),
        createdAt: new Date().toISOString(),
        ...customer,
      }
      setCustomers((prev) => [newCustomer, ...prev])
      return newCustomer
    },
    [setCustomers],
  )

  const updateCustomer = useCallback(
    (id, patch) => {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    [setCustomers],
  )

  const deleteCustomer = useCallback(
    (id) => {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    },
    [setCustomers],
  )

  const findOrCreateByName = useCallback(
    (name) => {
      if (!name?.trim()) return null
      const existing = customers.find((c) => c.name.toLowerCase() === name.trim().toLowerCase())
      if (existing) return existing
      return addCustomer({ name: name.trim(), whatsapp: '', address: '', notes: '' })
    },
    [customers, addCustomer],
  )

  return { customers, addCustomer, updateCustomer, deleteCustomer, findOrCreateByName, setCustomers }
}
