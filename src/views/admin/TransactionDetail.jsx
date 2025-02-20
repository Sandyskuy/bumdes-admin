import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const DetailTransaction = () => {
  const { id } = useParams() // Get transaction ID from URL params
  const [transaction, setTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [detailBarang, setDetailBarang] = useState([])

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:8080/transaksi/transaksi/${id}`)
        setTransaction(response.data)

        // Fetch detail barang for the transaction
        const detailResponse = await axios.get(
          `http://localhost:8080/detail-transaksi/by-transaksi/${id}`,
        )
        setDetailBarang(detailResponse.data)
      } catch (error) {
        console.error('Error fetching transaction:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransaction()
  }, [id])

  // Function to get status text based on status code
  const getStatusText = (statusCode) => {
    return statusCode == 1 ? 'Sudah Bayar' : 'Belum Bayar'
  }

  // Function to get status color based on status code
  const getStatusColor = (statusCode) => {
    return statusCode == 1 ? 'bg-success' : 'bg-danger'
  }

  const getStatusP = (statusCode) => {
    return statusCode == 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'
  }

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFont('Courier', 'normal')
    doc.setFontSize(10)

    doc.text('Invoice', 14, 20)
    doc.text(`Transaksi ID : ${transaction.id}`, 14, 30)
    doc.text(`Pengguna ID  : ${transaction.pengguna_id}`, 14, 40)
    doc.text(`Username    : ${transaction.username_pengguna}`, 14, 50)
    doc.text(`Status      : ${getStatusText(transaction.status)}`, 14, 60)
    doc.text(`Total       : Rp. ${transaction.total}`, 14, 70)
    doc.text(`Tanggal     : ${transaction.tanggal}`, 14, 80)

    doc.autoTable({
      head: [['No', 'Barang ID', 'Nama Barang', 'Harga Barang', 'Jumlah']],
      body: detailBarang.map((barang, index) => [
        index + 1,
        barang.barang_id,
        barang.nama_barang,
        barang.harga_barang,
        barang.jumlah,
      ]),
      startY: 90,
      theme: 'plain',
      styles: { font: 'Courier', fontSize: 10 },
      headStyles: { fontStyle: 'bold' },
    })

    doc.save(`invoice_${transaction.id}.pdf`)
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

  const renderBuktiPembayaranButton = () => {
    if (transaction && transaction.via === 'online') {
      return (
        <Link to={`/bukti_pembayaran/${transaction.id}`}>
          <CButton color="primary" className="ml-2">
            Bukti Pembayaran
          </CButton>
        </Link>
      )
    }
    return null
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol xs={8}>
                <h5 className="mb-0">Detail Transaksi</h5>
              </CCol>
              <CCol xs={4} className="text-end">
                {renderBuktiPembayaranButton()}
                <CButton className="ms-3 responsive " color="primary" onClick={generatePDF}>
                  Cetak PDF
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {isLoading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : transaction ? (
              <div>
                <div className="d-flex mb-2">
                  <div className="flex-fill">
                    <p>
                      <strong>Transaksi ID:</strong> {transaction.id}
                    </p>
                    <p>
                      <strong>Username:</strong> {transaction.username_pengguna}
                    </p>
                    <p>
                      <strong>Nomor Whatsapp:</strong> {transaction.phone_number}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`p-1 rounded ${getStatusColor(transaction.status)}`}
                        style={{ fontSize: '14px', marginRight: '10px' }}
                      >
                        {getStatusText(transaction.status)}
                      </span>
                      <span
                        className={`p-1 rounded ${getStatusColor(transaction.status_pembayaran)}`}
                        style={{ fontSize: '14px' }}
                      >
                        {getStatusP(transaction.status_pembayaran)}
                      </span>
                    </p>
                  </div>
                  <div className="flex-fill">
                    <p>
                      <strong>Total:</strong> {renderHarga(transaction.total)}
                    </p>
                    <p>
                      <strong>Alamat:</strong> {transaction.alamat}
                    </p>
                    <p>
                      <strong>Tanggal:</strong> {transaction.tanggal}
                    </p>
                  </div>
                </div>
                <hr className="my-4" /> {/* Pemisah */}
                {detailBarang.length > 0 ? (
                  <div>
                    <h5>Detail Barang:</h5>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">No</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Barang ID</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Nama Barang</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Harga Barang</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Jumlah</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {detailBarang.map((barang, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{barang.barang_id}</CTableDataCell>
                            <CTableDataCell>{barang.nama_barang}</CTableDataCell>
                            <CTableDataCell>{renderHarga(barang.harga_barang)}</CTableDataCell>
                            <CTableDataCell>{barang.jumlah}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                ) : (
                  <p>tidak ada detail barang ditemukan.</p>
                )}
              </div>
            ) : (
              <p>tidak ada transaksi ditemukan dengan ID: {id}</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DetailTransaction
