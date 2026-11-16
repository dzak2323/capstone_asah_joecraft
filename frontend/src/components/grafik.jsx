// Grafik memakai Recharts. Warna mengikuti wireframe: pemasukan hijau,
// pengeluaran abu gelap, bukan merah merek.

import { Bar, BarChart, Cell, LabelList, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { juta, juta1, ribu } from '../lib/format'
import { WARNA_KELUAR, WARNA_MASUK } from './legenda'

const WARNA_SUMBU = '#CFCFCB'
const TEKS_SUMBU = { fontSize: 13, fill: '#5C5C5C' }
const WARNA_DONAT = ['#1F4E79', '#7B5EA7', '#C27A00', '#2E7D7A', '#8A5A44']

/** Etiket angka di atas batang. Memakai <text> biasa supaya tidak terpecah jadi dua baris. */
function buatEtiket(format, { tebal = false, warna = '#1A1A1A' } = {}) {
  return function Etiket({ x, y, width, value }) {
    return (
      <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={tebal ? 600 : 400} fill={warna}>
        {format(value)}
      </text>
    )
  }
}

const EtiketMasuk = buatEtiket(juta, { tebal: true, warna: '#2F6B3A' })
const EtiketKeluar = buatEtiket(juta, { warna: '#3A3A3A' })
const EtiketHarga = buatEtiket(ribu)

export function Legenda({ item }) {
  return (
    <div className="flex flex-wrap gap-3.5 text-[13px] text-teks-redup">
      {item.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3" style={i.gaya ?? { background: i.warna }} />
          {i.label}
        </span>
      ))}
    </div>
  )
}

export function ArusKasMingguan({ data }) {
  const baris = data.map((m) => ({ ...m, label: m.berjalan ? `${m.label} (berjalan)` : m.label }))
  const ringkasan = baris
    .map((m) => `${m.label}: masuk ${juta(m.masuk)}, keluar ${juta(m.keluar)}`)
    .join('. ')
  return (
    <div className="h-[260px]" role="img" aria-label={`Arus kas per minggu. ${ringkasan}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={baris} margin={{ top: 24, right: 24, left: 24, bottom: 0 }} barCategoryGap="20%" barGap={10}>
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: WARNA_SUMBU }} tick={TEKS_SUMBU} />
          <YAxis hide domain={[0, 'dataMax']} />
          <Bar dataKey="masuk" fill={WARNA_MASUK} maxBarSize={48} isAnimationActive={false}>
            <LabelList dataKey="masuk" content={EtiketMasuk} />
          </Bar>
          <Bar dataKey="keluar" fill={WARNA_KELUAR} maxBarSize={48} isAnimationActive={false}>
            <LabelList dataKey="keluar" content={EtiketKeluar} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DonatKategori({ data }) {
  return (
    <div className="mt-[18px] flex items-center gap-4">
      <PieChart width={112} height={112} role="img" aria-label="Pengeluaran per kategori">
        <Pie
          data={data}
          dataKey="nilai"
          nameKey="nama"
          innerRadius={32}
          outerRadius={56}
          startAngle={90}
          endAngle={-270}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((d, i) => (
            <Cell key={d.nama} fill={WARNA_DONAT[i % WARNA_DONAT.length]} />
          ))}
        </Pie>
      </PieChart>
      <ul className="m-0 flex list-none flex-col gap-[9px] p-0 text-sm">
        {data.map((d, i) => (
          <li key={d.nama} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3" style={{ background: WARNA_DONAT[i % WARNA_DONAT.length] }} />
            {d.nama} {d.persen}%
          </li>
        ))}
      </ul>
    </div>
  )
}

function skalaPiksel(props) {
  return props.height / props.payload.nilai
}

function BatangBulanan(props) {
  const { x, y, width, height, payload } = props
  if (payload.jenis !== 'estimasi') {
    return <rect x={x} y={y} width={width} height={height} fill={payload.jenis === 'berjalan' ? '#A8A8A3' : '#4A4A4A'} />
  }
  const skala = skalaPiksel(props)
  const yAtas = y - (payload.tinggi - payload.nilai) * skala
  const yBawah = y + (payload.nilai - payload.rendah) * skala
  const tengah = x + width / 2
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="url(#pola-estimasi)" stroke="#4A4A4A" strokeDasharray="4 3" />
      <line x1={tengah} x2={tengah} y1={yAtas} y2={yBawah} stroke="#1A1A1A" strokeWidth={2} />
      <line x1={tengah - 10} x2={tengah + 10} y1={yAtas} y2={yAtas} stroke="#1A1A1A" strokeWidth={2} />
      <line x1={tengah - 10} x2={tengah + 10} y1={yBawah} y2={yBawah} stroke="#1A1A1A" strokeWidth={2} />
    </g>
  )
}

function TickBulan({ x, y, payload }) {
  const [baris1, sisa] = payload.value.split(' (')
  const estimasi = sisa?.startsWith('estimasi')
  const gaya = { fontSize: 13, fill: estimasi ? '#1A1A1A' : '#5C5C5C', fontWeight: estimasi ? 700 : 400 }
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" y={16} {...gaya}>
        {baris1}
      </text>
      {sisa && (
        <text textAnchor="middle" y={32} {...gaya}>
          {`(${sisa}`}
        </text>
      )}
    </g>
  )
}

export function GrafikBulanan({ realisasi, berjalan, estimasi }) {
  const data = [
    ...realisasi.map((r) => ({ label: r.bulan, nilai: r.nilai, jenis: 'realisasi' })),
    { label: 'Nov (berjalan)', nilai: berjalan, jenis: 'berjalan' },
    { label: 'Des (estimasi)', nilai: estimasi.total, rendah: estimasi.rendah, tinggi: estimasi.tinggi, jenis: 'estimasi' },
  ]

  const labelNilai = (props) => {
    const { x, y, width, height, index } = props
    const d = data[index]
    const tebal = d.jenis === 'estimasi'
    const yAtas = tebal ? y - (d.tinggi - d.nilai) * (height / d.nilai) : y
    return (
      <text x={x + width / 2} y={yAtas - 6} textAnchor="middle" fontSize={12} fontWeight={tebal ? 700 : 400} fill="#1A1A1A">
        {juta1(d.nilai)}
      </text>
    )
  }

  const ringkasan = data.map((d) => `${d.label} ${juta1(d.nilai)}`).join(', ')
  return (
    <div className="mt-4 h-[290px]" role="img" aria-label={`Pengeluaran bisnis per bulan. ${ringkasan}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 30, right: 10, left: 10, bottom: 0 }} barCategoryGap="25%">
          <defs>
            <pattern id="pola-estimasi" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
              <rect width="12" height="12" fill="#EFEFED" />
              <rect width="6" height="12" fill="#D6D6D2" />
            </pattern>
          </defs>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: WARNA_SUMBU }}
            tick={TickBulan}
            height={44}
            interval={0}
          />
          <YAxis hide domain={[0, estimasi.tinggi]} />
          <Bar dataKey="nilai" shape={BatangBulanan} maxBarSize={52} isAnimationActive={false}>
            <LabelList dataKey="nilai" content={labelNilai} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GrafikHarga({ nilai, bulan, nama }) {
  const data = nilai.map((v, i) => ({ label: bulan[i], nilai: v }))
  const ringkasan = data.map((d) => `${d.label} ${ribu(d.nilai)}`).join(', ')
  return (
    <div className="mt-4 h-[190px]" role="img" aria-label={`Harga ${nama} per bulan. ${ringkasan}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 22, right: 6, left: 6, bottom: 0 }} barCategoryGap="20%">
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: WARNA_SUMBU }} tick={{ fontSize: 12, fill: '#5C5C5C' }} />
          <YAxis hide domain={[0, 'dataMax']} />
          <Bar dataKey="nilai" fill={WARNA_KELUAR} isAnimationActive={false}>
            <LabelList dataKey="nilai" content={EtiketHarga} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
