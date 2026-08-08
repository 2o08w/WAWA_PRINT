import { Menu } from 'lucide-react'
import { initials } from '../utils/format'

const TODAY = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function Topbar({ storeName, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 bg-ink-950/85 backdrop-blur-md border-b border-ink-700">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-ink-800 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block min-w-0">
          <p className="text-xs text-slate-500 truncate">{TODAY}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium text-slate-100">{storeName || 'Wais Print'}</span>
          <span className="text-[11px] text-slate-500">Pemilik Usaha</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials(storeName || 'Wais Print')}
        </div>
      </div>
    </header>
  )
}
