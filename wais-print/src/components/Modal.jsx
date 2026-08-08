import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} bg-ink-850 border border-ink-600 rounded-2xl shadow-2xl animate-scaleIn max-h-[88vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-ink-700">
          <div>
            <h2 className="text-base font-semibold text-slate-100 font-display">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-ink-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="p-5 pt-3 border-t border-ink-700 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
