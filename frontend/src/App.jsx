import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import PenyediaAuth from './auth/PenyediaAuth'
import { useAuth } from './auth/konteks'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Estimasi from './pages/Estimasi'
import Login from './pages/Login'
import LupaSandi from './pages/LupaSandi'
import Riwayat from './pages/Riwayat'

function RutePrivat() {
  const { email } = useAuth()
  return email ? <Outlet /> : <Navigate to="/masuk" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <PenyediaAuth>
        <Routes>
          <Route path="/masuk" element={<Login />} />
          <Route path="/lupa-kata-sandi" element={<LupaSandi />} />
          <Route element={<RutePrivat />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="riwayat" element={<Riwayat />} />
              <Route path="estimasi" element={<Estimasi />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PenyediaAuth>
    </BrowserRouter>
  )
}
