import React, { useEffect, useState, useCallback } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CWidgetStatsD } from '@coreui/react'
import { cilPeople, cilMoney } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const DashboardAdmin = () => {
  const [data, setData] = useState([])
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0)
  const [totalPembelian, setTotalPembelian] = useState(0)
  const [totalPembelianOnline, setTotalPembelianOnline] = useState(0)
  const [totalPembelianOffline, setTotalPembelianOffline] = useState(0)
  const [loading, setLoading] = useState(true)
  const currentDate = new Date()

  // Consolidated fetch function
  const fetchData = useCallback(async (url, setter) => {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      setter(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchData('http://localhost:8080/api/laporanperbulan', (jsonData) => {
      const formattedData = Object.keys(jsonData.total).map((bulan) => ({
        bulan: bulan,
        total: jsonData.total[bulan],
        total_online: jsonData.total_online[bulan],
        total_offline: jsonData.total_offline[bulan],
      }))
      setData(formattedData)
    })
    fetchData('http://localhost:8080/api/totaltransaksi', (jsonData) =>
      setJumlahTransaksi(jsonData.count_transaksi),
    )
    fetchData('http://localhost:8080/api/laporan', (jsonData) =>
      setTotalPembelian(jsonData.total_pembelian),
    )
    fetchData('http://localhost:8080/api/laporanonline', (jsonData) =>
      setTotalPembelianOnline(jsonData.total_pembelian),
    )
    fetchData('http://localhost:8080/api/laporanoffline', (jsonData) =>
      setTotalPembelianOffline(jsonData.total_pembelian),
    )
    setLoading(false)
  }, [fetchData])

  // Utility function to format Rupiah
  const formatRupiah = (angka) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    })
    return formatter.format(angka)
  }

  const renderHarga = (harga) => {
    return formatRupiah(harga)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Pendapatan', value: renderHarga(totalPembelian) }]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
              values={[
                { title: 'Total Pendapatan Online', value: renderHarga(totalPembelianOnline) },
              ]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="info"
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
              values={[
                { title: 'Total Pendapatan Offline', value: renderHarga(totalPembelianOffline) },
              ]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="info"
            />
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <h4 style={{ textAlign: 'left', marginBottom: '20px' }}>Grafik Pendapatan Per Bulan</h4>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="total_online" stroke="#82ca9d" />
          <Line type="monotone" dataKey="total_offline" stroke="#ff7300" />
        </LineChart>
      </CCardBody>
    </CCard>
  )
}

export default DashboardAdmin
