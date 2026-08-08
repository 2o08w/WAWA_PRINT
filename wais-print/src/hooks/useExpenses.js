import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { generateId } from '../utils/id'
import { todayISO } from '../utils/date'

// Shape of an expense: { id, title, category, amount, date, notes, createdAt }

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEYS.expenses, [])

  const addExpense = useCallback(
    (expense) => {
      const newExpense = {
        id: generateId('exp'),
        date: expense.date || todayISO(),
        createdAt: new Date().toISOString(),
        ...expense,
        amount: Number(expense.amount) || 0,
      }
      setExpenses((prev) => [newExpense, ...prev])
      return newExpense
    },
    [setExpenses],
  )

  const updateExpense = useCallback(
    (id, patch) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch, amount: Number(patch.amount ?? e.amount) || 0 } : e)),
      )
    },
    [setExpenses],
  )

  const deleteExpense = useCallback(
    (id) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    },
    [setExpenses],
  )

  return { expenses, addExpense, updateExpense, deleteExpense, setExpenses }
}
