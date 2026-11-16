import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/konteks'
import { Tombol } from '../components/dasar'

const KOTAK_ISI =
  'min-h-11 w-full rounded-lg border border-garis-tebal bg-white px-3.5 py-3 text-base text-teks placeholder:text-teks-mati'

export default function Login() {
  const { email: sudahMasuk, masuk } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sandi, setSandi] = useState('')
  const [pesan, setPesan] = useState('')

  if (sudahMasuk) return <Navigate to="/" replace />

  const kirim = (e) => {
    e.preventDefault()
    if (!email.trim() || !sandi) {
      setPesan('Isi email dan kata sandi terlebih dahulu.')
      return
    }
    masuk(email.trim())
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-latar px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-[18px]">
        <form
          onSubmit={kirim}
          noValidate
          className="flex flex-col gap-5 rounded-[14px] border border-garis bg-white px-8 pb-7 pt-8"
        >
          <div className="flex justify-center">
            <img src="/logo-joecraft.png" alt="Logo Jo-E Craft" className="block h-auto w-[150px]" />
          </div>
          <div className="text-center">
            <h1 className="m-0 text-2xl font-bold">Masuk ke dashboard</h1>
            <p className="mb-0 mt-1.5 text-sm leading-normal text-teks-redup">
              Lihat laporan keuangan dan estimasi bulan depan.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={KOTAK_ISI}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sandi" className="text-sm font-semibold">
              Kata sandi
            </label>
            <input
              id="sandi"
              type="password"
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              className={KOTAK_ISI}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="ingat" className="flex items-center gap-2 text-sm">
              <input id="ingat" type="checkbox" className="m-0 h-[18px] w-[18px]" />
              Ingat saya di perangkat ini
            </label>
            <Link to="/lupa-kata-sandi" className="text-sm font-semibold text-merek hover:text-merek-tautan">
              Lupa kata sandi?
            </Link>
          </div>

          {pesan && (
            <p role="alert" className="m-0 text-sm text-netral-teks">
              {pesan}
            </p>
          )}

          <Tombol type="submit" className="w-full text-base">
            Masuk
          </Tombol>
        </form>

        <p className="m-0 text-center text-[13px] leading-normal text-teks-redup">
          Akun dibuat oleh tim pengembang untuk owner dan admin pencatatan. Pencatatan transaksi dilakukan lewat WhatsApp,
          bukan di halaman ini.
        </p>
      </div>
    </div>
  )
}
