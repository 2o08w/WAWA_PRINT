import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Target,
  Printer,
  Users,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transaksi', label: 'Transaksi', icon: Receipt },
  { to: '/target', label: 'Target Bulanan', icon: Target },
  { to: '/layanan', label: 'Layanan', icon: Printer },
  { to: '/pelanggan', label: 'Pelanggan', icon: Users },
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function Sidebar({ storeName, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 shrink-0 bg-ink-900 border-r border-ink-700 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="relative h-16 flex items-center justify-between px-5 border-b border-ink-700 overflow-hidden">
          <div className="absolute inset-0 bg-grid-dots bg-dots-sm opacity-40 pointer-events-none" />
          <div className="relative flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-accent-500 flex items-center justify-center shadow-glow shrink-0">
              <Printer className="h-4 w-4 text-white" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white font-display tracking-tight">{storeName || 'Wais Print'}</p>
              <p className="text-[10px] text-slate-500 tracking-wide">MANAJEMEN USAHA</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden relative text-slate-500 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-none">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-500/15 text-accent-300'
                    : 'text-slate-400 hover:bg-ink-800 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                    style={{ width: 18, height: 18 }}
                  />
                  {label}
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ink-700">
          <div className="rounded-xl bg-ink-800/60 border border-ink-600/60 px-3.5 py-3">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Data tersimpan otomatis di perangkat ini melalui Local Storage.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
