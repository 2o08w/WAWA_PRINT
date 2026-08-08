import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { generateId } from '../utils/id'
import { todayISO } from '../utils/date'

// Shape of a transaction:
// { id, customerName, serviceName, category, quantity, price, total,
//   status: 'Lunas' | 'Belum Lunas', date, notes, createdAt }

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.transactions, [])

  const addTransaction = useCallback(
    (tx) => {
      const quantity = Number(tx.quantity) || 0
      const price = Number(tx.price) || 0
      const newTx = {
        id: generateId('trx'),
        date: tx.date || todayISO(),
        createdAt: new Date().toISOString(),
        ...tx,
        quantity,
        price,
        total: quantity * price,
      }
      setTransactions((prev) => [newTx, ...prev])
      return newTx
    },
    [setTransactions],
  )

  const updateTransaction = useCallback(
    (id, patch) => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t
          const merged = { ...t, ...patch }
          const quantity = Number(merged.quantity) || 0
          const price = Number(merged.price) || 0
          return { ...merged, quantity, price, total: quantity * price }
        }),
      )
    },
    [setTransactions],
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    },
    [setTransactions],
  )

  return { transactions, addTransaction, updateTransaction, deleteTransaction, setTransactions }
}
