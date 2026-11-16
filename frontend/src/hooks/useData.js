import { useEffect, useState } from 'react'

/**
 * Memanggil fungsi pengambil data dan menyediakan status memuat / gagal.
 * `fn` harus fungsi yang stabil (dari src/api), `args` daftar argumennya.
 * `ulang()` mengambil data lagi, dipakai tombol "Coba lagi".
 */
export function useData(fn, args = []) {
  const kunciArgs = JSON.stringify(args)
  const [ulangKe, setUlangKe] = useState(0)
  const kunci = `${kunciArgs}#${ulangKe}`
  const [hasil, setHasil] = useState({ kunci: null, data: null, error: null })

  useEffect(() => {
    let batal = false
    fn(...JSON.parse(kunciArgs))
      .then((data) => {
        if (!batal) setHasil({ kunci, data, error: null })
      })
      .catch((error) => {
        if (!batal) setHasil({ kunci, data: null, error })
      })
    return () => {
      batal = true
    }
  }, [fn, kunciArgs, kunci])

  const selesai = hasil.kunci === kunci
  return {
    data: selesai ? hasil.data : null,
    error: selesai ? hasil.error : null,
    memuat: !selesai,
    ulang: () => setUlangKe((n) => n + 1),
  }
}
