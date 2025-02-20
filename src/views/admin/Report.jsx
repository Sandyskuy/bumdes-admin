import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CWidgetStatsD,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import { cilPeople, cilMoney } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const PembelianPerBulanChart = () => {
  const [data, setData] = useState([])
  const [totalBuyer, setTotalBuyer] = useState(0)
  const [totalStaff, setTotalStaff] = useState(0)
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0)
  const [totalPembelian, setTotalPembelian] = useState(0)
  const [totalPembelianOnline, setTotalPembelianOnline] = useState(0)
  const [totalPembelianOffline, setTotalPembelianOffline] = useState(0)
  const [laporanKeuangan, setLaporanKeuangan] = useState([])
  const [rekap, setRekap] = useState([])
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' }).toLowerCase()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedVia, setSelectedVia] = useState(null) // State untuk menyimpan jenis via yang dipilih

  useEffect(() => {
    fetchData()
    fetchTotalBuyer()
    fetchTotalStaff()
    fetchJumlahTransaksi()
    fetchTotalPembelian()
    fetchTotalPembelianOnline()
    fetchTotalPembelianOffline()

    fetchLaporanKeuangan(selectedMonth, selectedVia) // Memperbarui pemanggilan fungsi fetchLaporanKeuangan dengan selectedVia
    fetchRekap(selectedMonth, selectedVia)
  }, [selectedMonth, selectedVia])

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/laporanperbulan')
      const jsonData = await response.json()
      // Format data sesuai dengan struktur yang diharapkan oleh Recharts
      const formattedData = Object.keys(jsonData.total).map((bulan) => ({
        bulan: bulan,
        total: jsonData.total[bulan],
        total_online: jsonData.total_online[bulan],
        total_offline: jsonData.total_offline[bulan],
      }))
      setData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchTotalBuyer = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/totalbuyer')
      const jsonData = await response.json()
      setTotalBuyer(jsonData.total_buyer)
    } catch (error) {
      console.error('Error fetching total buyer:', error)
    }
  }

  const fetchTotalStaff = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/totalstaff')
      const jsonData = await response.json()
      setTotalStaff(jsonData.total_staff)
    } catch (error) {
      console.error('Error fetching total staff:', error)
    }
  }

  const fetchJumlahTransaksi = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/totaltransaksi')
      const jsonData = await response.json()
      setJumlahTransaksi(jsonData.count_transaksi)
    } catch (error) {
      console.error('Error fetching total transaksi:', error)
    }
  }

  const fetchTotalPembelian = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/laporan')
      const jsonData = await response.json()
      setTotalPembelian(jsonData.total_pembelian)
    } catch (error) {
      console.error('Error fetching total pembelian:', error)
    }
  }
  const fetchTotalPembelianOnline = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/laporanonline')
      const jsonData = await response.json()
      setTotalPembelianOnline(jsonData.total_pembelian)
    } catch (error) {
      console.error('Error fetching total pembelian:', error)
    }
  }

  const fetchTotalPembelianOffline = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/laporanoffline')
      const jsonData = await response.json()
      setTotalPembelianOffline(jsonData.total_pembelian)
    } catch (error) {
      console.error('Error fetching total pembelian:', error)
    }
  }

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

  const fetchLaporanKeuangan = async (month, via) => {
    try {
      let url = `http://localhost:8080/api/laporan-keuangan/${month}`
      if (via !== undefined && via !== null) {
        url += `/${via}`
      }
      const response = await fetch(url)
      const jsonData = await response.json()
      setLaporanKeuangan(jsonData)
    } catch (error) {
      console.error('Error fetching laporan keuangan:', error)
    }
  }

  const fetchRekap = async (month, via) => {
    try {
      let url = `http://localhost:8080/api/rekap/${month}`
      if (via !== undefined && via !== null) {
        url += `/${via}`
      }
      const response = await fetch(url)
      const jsonData = await response.json()
      setRekap(jsonData)
    } catch (error) {
      console.error('Error fetching rekap data:', error)
    }
  }

  const handleViaChange = (via) => {
    setSelectedVia(via === 'semua' ? null : via) // Mengatur selectedVia menjadi null jika "Semua" dipilih
  }

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
  }

  const handleYearChange = () => {
    setSelectedMonth('tahun')
  }

  const renderLaporanKeuangan = () => {
    if (!laporanKeuangan || laporanKeuangan.length === 0) {
      return <div>Loading...</div>
    }

    const totalTransaksi = laporanKeuangan.laporan
      .reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0)
      .toFixed(2)

    return (
      <div id="laporan-keuangan">
        <h4 className="mb-4">Laporan Transaksi untuk Bulan {selectedMonth}</h4>
        <div className="d-flex align-items-center mb-4">
          <CDropdown className="me-2">
            <CDropdownToggle caret color="primary">
              Pilih Bulan
            </CDropdownToggle>
            <CDropdownMenu>
              {[
                'januari',
                'februari',
                'maret',
                'april',
                'mei',
                'juni',
                'juli',
                'agustus',
                'september',
                'oktober',
                'november',
                'desember',
              ].map((month) => (
                <CDropdownItem key={month} onClick={() => handleMonthChange(month)}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
          <CDropdown className="me-2">
            {' '}
            {/* Dropdown untuk memilih jenis via */}
            <CDropdownToggle caret color="primary">
              Pilih Via
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => handleViaChange('semua')}>Semua</CDropdownItem>
              <CDropdownItem onClick={() => handleViaChange('online')}>Online</CDropdownItem>
              <CDropdownItem onClick={() => handleViaChange('offline')}>Offline</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CButton color="primary" className="me-2" onClick={handleYearChange}>
            Tahun Ini
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              downloadPDF(
                'laporan-keuangan',
                `Laporan_Keuangan_${selectedMonth}`,
                selectedMonth,
                'laporan',
              )
            }
          >
            Download PDF
          </CButton>
        </div>
        <CTable striped bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID Transaksi</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tanggal</CTableHeaderCell>
              <CTableHeaderCell scope="col">Via</CTableHeaderCell>
              <CTableHeaderCell scope="col">Stok Dibeli</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {laporanKeuangan.laporan && laporanKeuangan.laporan.length > 0 ? (
              <>
                {laporanKeuangan.laporan.map((transaksi, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{transaksi.id}</CTableDataCell>
                    <CTableDataCell>{transaksi.tanggal}</CTableDataCell>
                    <CTableDataCell>{transaksi.via}</CTableDataCell>
                    <CTableDataCell>
                      {transaksi.stok_dibeli &&
                        Object.entries(transaksi.stok_dibeli).map(([barangId, dataBarang], idx) => (
                          <div key={idx}>
                            {dataBarang.nama}, ({dataBarang.jumlah})
                          </div>
                        ))}
                    </CTableDataCell>
                    <CTableDataCell>{formatRupiah(transaksi.total)}</CTableDataCell>
                    <CTableDataCell>
                      {transaksi.status === '1' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
                <CTableRow>
                  <CTableDataCell colSpan="4">Total</CTableDataCell>
                  <CTableDataCell>{formatRupiah(totalTransaksi)}</CTableDataCell>
                  <CTableDataCell colSpan="2"></CTableDataCell>
                </CTableRow>
              </>
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5">Tidak ada data di bulan ini</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    )
  }

  const renderRekap = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10 // Set the number of items per page
    if (rekap.length === 0) {
      return <div>Loading...</div>
    }

    const totalHarga = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.harga || 0), 0)
      .toFixed(2)
    const totalStokAwal = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.stok_awal || 0), 0)
      .toFixed(2)
    const totalTerjual = rekap.rekap.reduce((acc, curr) => acc + curr.terjual, 0)
    const totalSisa = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.sisa || 0), 0)
      .toFixed(2)
    const totalSisaHarga = rekap.rekap.reduce((acc, curr) => acc + curr.nilai_sisa, 0)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = rekap.rekap.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(rekap.rekap.length / itemsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const pageNumbers = []
    if (totalPages <= 5) {
      // If there are 5 or fewer pages, display them all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Show first and last pages and a range of pages in the middle
      pageNumbers.push(1)
      if (currentPage > 3) pageNumbers.push('...')
      const start = currentPage - 1 > 1 ? currentPage - 1 : 2
      const end = currentPage + 1 < totalPages ? currentPage + 1 : totalPages - 1
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      if (currentPage < totalPages - 2) pageNumbers.push('...')
      if (currentPage !== totalPages) pageNumbers.push(totalPages)
    }

    return (
      <div id="rekap-bulan">
        <h4 className="mb-4">Rekap untuk Bulan {selectedMonth}</h4>
        <CButton
          color="primary"
          className="mb-4"
          onClick={() =>
            downloadPDF('rekap-bulan', `Rekap_${selectedMonth}`, selectedMonth, 'rekap')
          }
        >
          Download PDF
        </CButton>
        <CTable striped bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID Barang</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nama Barang</CTableHeaderCell>
              <CTableHeaderCell scope="col">Harga</CTableHeaderCell>
              <CTableHeaderCell scope="col">Stok Awal</CTableHeaderCell>
              <CTableHeaderCell scope="col">Terjual</CTableHeaderCell>
              <CTableHeaderCell scope="col">Sisa</CTableHeaderCell>
              <CTableHeaderCell scope="col">Sisa Harga</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length > 0 ? (
              <>
                {currentItems.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.nama}</CTableDataCell>
                    <CTableDataCell>{formatRupiah(item.harga)}</CTableDataCell>
                    <CTableDataCell>{item.stok_awal}</CTableDataCell>
                    <CTableDataCell>{item.terjual}</CTableDataCell>
                    <CTableDataCell>{item.sisa}</CTableDataCell>
                    <CTableDataCell>{formatRupiah(item.nilai_sisa)}</CTableDataCell>
                  </CTableRow>
                ))}
                <CTableRow>
                  <CTableDataCell colSpan="2">Total</CTableDataCell>
                  <CTableDataCell>{formatRupiah(totalHarga)}</CTableDataCell>
                  <CTableDataCell>{totalStokAwal}</CTableDataCell>
                  <CTableDataCell>{totalTerjual}</CTableDataCell>
                  <CTableDataCell>{totalSisa}</CTableDataCell>
                  <CTableDataCell>{formatRupiah(totalSisaHarga)}</CTableDataCell>
                </CTableRow>
              </>
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7">Tidak ada data di bulan ini</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        <div className="d-flex justify-content-center">
          <CButton
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className="pagination-btn"
          >
            &laquo; Prev
          </CButton>
          {pageNumbers.map((page, index) =>
            page === '...' ? (
              <span key={index} className="mx-2">
                ...
              </span>
            ) : (
              <CButton
                key={index}
                onClick={() => paginate(page)}
                active={page === currentPage}
                className="pagination-btn"
              >
                {page}
              </CButton>
            ),
          )}
          <CButton
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
            className="pagination-btn"
          >
            Next &raquo;
          </CButton>
        </div>
      </div>
    )
  }

  const downloadPDF = (elementId, filename, selectedMonth, type) => {
    const doc = new jsPDF()
    const header =
      type === 'laporan'
        ? `Laporan Keuangan untuk Bulan ${selectedMonth}`
        : `Rekap untuk Bulan ${selectedMonth}`

    doc.text(header, 14, 20)

    const tableData = type === 'laporan' ? laporanKeuangan.laporan : rekap.rekap
    const columns =
      type === 'laporan'
        ? [['ID Transaksi', 'Tanggal', 'via', 'Stok Dibeli', 'Total', 'Status']]
        : [['ID Barang', 'Nama Barang', 'Harga', 'Stok Awal', 'Terjual', 'Sisa', 'Sisa Harga']]
    const body = tableData.map((row) => {
      if (type === 'laporan') {
        return [
          row.id,
          row.tanggal,
          row.via,
          Object.entries(row.stok_dibeli)
            .map(([barangId, dataBarang]) => `${dataBarang.nama} (${dataBarang.jumlah})`)
            .join('\n'),
          formatRupiah(row.total),
          row.status === '1' ? 'Sudah Dibayar' : 'Belum Dibayar',
        ]
      } else {
        return [
          row.id,
          row.nama,
          formatRupiah(row.harga),
          row.stok_awal,
          row.terjual,
          row.sisa,
          formatRupiah(row.nilai_sisa),
        ]
      }
    })

    const total = type === 'laporan' ? getTotalLaporanKeuangan() : getTotalRekap()

    doc.autoTable({
      startY: 30,
      head: columns,
      body: [...body, total],
    })

    doc.save(`${filename}.pdf`)
  }

  const getTotalLaporanKeuangan = () => {
    const totalTransaksi = laporanKeuangan.laporan
      .reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0)
      .toFixed(2)
    return [{ content: 'Total', colSpan: 4 }, formatRupiah(totalTransaksi), '', '', '']
  }

  const getTotalRekap = () => {
    const totalHarga = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.harga || 0), 0)
      .toFixed(2)
    const totalStokAwal = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.stok_awal || 0), 0)
      .toFixed(2)
    const totalTerjual = rekap.rekap.reduce((acc, curr) => acc + curr.terjual, 0)
    const totalSisa = rekap.rekap
      .reduce((acc, curr) => acc + parseFloat(curr.sisa || 0), 0)
      .toFixed(2)
    const totalSisaHarga = rekap.rekap.reduce((acc, curr) => acc + curr.nilai_sisa, 0)
    return [
      { content: 'Total', colSpan: 2 },
      '',
      formatRupiah(totalHarga),
      totalStokAwal,
      totalTerjual,
      totalSisa,
      formatRupiah(totalSisaHarga),
    ]
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilPeople} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Pembeli', value: totalBuyer }]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="primary"
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilPeople} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Staff', value: totalStaff }]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="success"
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Transaksi', value: jumlahTransaksi }]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="danger"
            />
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsD
              icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Pendapatan', value: renderHarga(totalPembelian) }]}
              style={{ '--cui-card-cap-bg': '#00aced' }}
              color="info"
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
          <Line type="monotone" dataKey="total_online" stroke="#82ca9d" />{' '}
          {/* Menambahkan garis untuk total pembelian online */}
          <Line type="monotone" dataKey="total_offline" stroke="#ff7300" />{' '}
          {/* Menambahkan garis untuk total pembelian offline */}
        </LineChart>

        <hr />
        {renderLaporanKeuangan()}
        <hr />
        {renderRekap()}
      </CCardBody>
    </CCard>
  )
}

export default PembelianPerBulanChart
