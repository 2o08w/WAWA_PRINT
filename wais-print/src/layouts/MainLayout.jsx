import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useSettings } from '../hooks/useSettings'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { settings } = useSettings()

  return (
    <div className="min-h-screen flex bg-ink-950">
      <Sidebar storeName={settings.storeName} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar storeName={settings.storeName} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
