import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import MonthlyTarget from './pages/MonthlyTarget'
import Services from './pages/Services'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import SettingsPage from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaksi" element={<Transactions />} />
        <Route path="/target" element={<MonthlyTarget />} />
        <Route path="/layanan" element={<Services />} />
        <Route path="/pelanggan" element={<Customers />} />
        <Route path="/laporan" element={<Reports />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
