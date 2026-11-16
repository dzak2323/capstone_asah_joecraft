import { useCallback, useMemo, useState } from 'react'
import { KonteksAuth } from './konteks'

// SEMENTARA: login belum tersambung ke backend. Email apa pun diterima dan
// hanya diingat di browser. Nanti diganti dengan pemanggilan ke API login.
const KUNCI = 'jc_pengguna'

function bacaTersimpan() {
  try {
    return localStorage.getItem(KUNCI)
  } catch {
    return null
  }
}

export default function PenyediaAuth({ children }) {
  const [email, setEmail] = useState(bacaTersimpan)

  const masuk = useCallback((emailBaru) => {
    try {
      localStorage.setItem(KUNCI, emailBaru)
    } catch {
      // Penyimpanan diblokir: login tetap jalan selama halaman terbuka.
    }
    setEmail(emailBaru)
  }, [])

  const keluar = useCallback(() => {
    try {
      localStorage.removeItem(KUNCI)
    } catch {
      // Abaikan.
    }
    setEmail(null)
  }, [])

  const nilai = useMemo(() => ({ email, masuk, keluar }), [email, masuk, keluar])
  return <KonteksAuth.Provider value={nilai}>{children}</KonteksAuth.Provider>
}
