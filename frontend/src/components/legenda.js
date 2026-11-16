// Konstanta legenda dan warna grafik. Dipisah dari grafik.jsx agar file komponen
// hanya berisi komponen (syarat fast refresh).

export const WARNA_MASUK = '#4C9A5B'
export const WARNA_KELUAR = '#4A4A4A'

export const LEGENDA_ARUS_KAS = [
  { label: 'Masuk', warna: WARNA_MASUK },
  { label: 'Keluar (usaha)', warna: WARNA_KELUAR },
]

export const LEGENDA_BULANAN = [
  { label: 'Realisasi', warna: '#4A4A4A' },
  { label: 'Bulan berjalan', warna: '#A8A8A3' },
  {
    label: 'Estimasi dan kisaran',
    gaya: {
      border: '1px dashed #4A4A4A',
      background: 'repeating-linear-gradient(45deg,#D6D6D2 0 4px,#EFEFED 4px 8px)',
    },
  },
]
