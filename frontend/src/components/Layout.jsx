import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/konteks'

const MENU = [
  { ke: '/', label: 'Dashboard', ujung: true },
  { ke: '/riwayat', label: 'Riwayat' },
  { ke: '/estimasi', label: 'Estimasi bulan depan' },
]

export default function Layout() {
  const { keluar } = useAuth()
  const navigate = useNavigate()

  const tekanKeluar = () => {
    keluar()
    navigate('/masuk')
  }

  return (
    <div className="flex min-h-screen bg-latar">
      <nav
        aria-label="Menu utama"
        className="sticky top-0 flex h-screen w-[220px] shrink-0 flex-col gap-1.5 border-r border-garis bg-white px-[18px] py-7"
      >
        <div className="mb-6 flex justify-center">
          <img src="/logo-joecraft.png" alt="Logo Jo-E Craft" className="block h-auto w-[140px]" />
        </div>
        {MENU.map((m) => (
          <NavLink
            key={m.ke}
            to={m.ke}
            end={m.ujung}
            className={({ isActive }) =>
              `rounded-lg px-3.5 py-[11px] text-[15px] ${isActive ? 'bg-merek font-semibold text-white' : 'text-teks hover:bg-latar'}`
            }
          >
            {m.label}
          </NavLink>
        ))}
        <div className="mt-auto flex flex-col gap-3 border-t border-garis pt-4">
          <button
            type="button"
            onClick={tekanKeluar}
            className="cursor-pointer self-start rounded-lg px-3.5 py-2 text-left text-sm font-semibold text-merek hover:text-merek-tautan"
          >
            Keluar
          </button>
          <p className="m-0 text-[13px] leading-normal text-teks-redup">
            Catat transaksi lewat WhatsApp. Halaman ini hanya untuk melihat laporan.
          </p>
        </div>
      </nav>
      <main className="flex min-w-0 flex-1 flex-col gap-[22px] px-9 py-7">
        <Outlet />
      </main>
    </div>
  )
}
