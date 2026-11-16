import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tombol } from '../components/dasar'

// SEMENTARA: belum mengirim email sungguhan. Nanti memanggil endpoint reset kata sandi.
// Pesan di layar sengaja sama untuk email terdaftar maupun tidak.

export default function LupaSandi() {
  const [email, setEmail] = useState('')
  const [terkirim, setTerkirim] = useState(false)

  const kirim = (e) => {
    e.preventDefault()
    setTerkirim(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-latar px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-[18px]">
        <div className="flex flex-col gap-5 rounded-[14px] border border-garis bg-white px-8 pb-7 pt-8">
          <div className="flex justify-center">
            <img src="/logo-joecraft.png" alt="Logo Jo-E Craft" className="block h-auto w-[150px]" />
          </div>

          {!terkirim ? (
            <form onSubmit={kirim} className="flex flex-col gap-5">
              <div className="text-center">
                <h1 className="m-0 text-2xl font-bold">Atur ulang kata sandi</h1>
                <p className="mb-0 mt-1.5 text-sm leading-normal text-teks-redup">
                  Masukkan email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-garis-tebal bg-white px-3.5 py-3 text-base text-teks placeholder:text-teks-mati"
                />
              </div>
              <Tombol type="submit" className="w-full text-base">
                Kirim tautan
              </Tombol>
              <Link to="/masuk" className="text-center text-sm font-semibold text-merek hover:text-merek-tautan">
                Kembali ke halaman masuk
              </Link>
            </form>
          ) : (
            <div className="flex flex-col gap-5" role="status">
              <div className="text-center">
                <h1 className="m-0 text-2xl font-bold">Cek email Anda</h1>
                <p className="mb-0 mt-2 text-sm leading-relaxed text-teks-redup">
                  Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Tautan hanya berlaku beberapa
                  menit.
                </p>
              </div>
              <p className="m-0 rounded-[10px] border border-garis bg-latar px-3.5 py-3 text-[13px] leading-relaxed text-teks-redup">
                Belum menerima email? Periksa folder spam, atau hubungi tim pengembang karena akun dibuat secara manual.
              </p>
              <Link
                to="/masuk"
                className="flex min-h-11 items-center justify-center rounded-lg bg-merek px-[18px] py-[13px] text-base font-semibold text-white hover:bg-merek-gelap"
              >
                Kembali ke halaman masuk
              </Link>
              <button
                type="button"
                onClick={() => setTerkirim(false)}
                className="min-h-11 cursor-pointer text-sm font-semibold text-merek hover:text-merek-tautan"
              >
                Kirim ulang tautan
              </button>
            </div>
          )}
        </div>

        <p className="m-0 text-center text-[13px] leading-normal text-teks-redup">
          Tautan reset akan membuka halaman untuk membuat kata sandi baru.
        </p>
      </div>
    </div>
  )
}
