import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Online = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('http://localhost:8080/transaksi/offline')
        const data = response.data
        setTransactions(Array.isArray(data) ? data : []) // Pastikan data adalah array
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setTransactions([]) // Hindari undefined
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const getStatusText = (statusCode) => {
    return statusCode == 1 ? 'Sudah Bayar' : 'Belum Bayar'
  }

  const getStatusColor = (statusCode) => {
    return statusCode == 1 ? 'bg-success' : 'bg-danger'
  }

  const sortedTransactions = () => {
    let sortableItems = [...transactions]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'tanggal') {
          const dateA = new Date(a.tanggal)
          const dateB = new Date(b.tanggal)
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA
        } else {
          const valA = a[sortConfig.key]
          const valB = b[sortConfig.key]
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA
        }
      })
    }
    return sortableItems
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return ' ↑'
      } else if (sortConfig.direction === 'descending') {
        return ' ↓'
      }
    }
    return ''
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
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

  const paginatedTransactions = sortedTransactions().slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )
  const pageCount = Math.ceil(transactions.length / itemsPerPage)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol xs={8}>
                <h5 className="mb-0">Data Transaksi</h5>
              </CCol>
              <CCol xs={4} className="text-end">
                <Link to={`/transactionoff`} className="btn btn-primary btn-sm">
                  Tambah Transaksi
                </Link>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell onClick={() => requestSort('id')}>
                    No{renderSortArrow('id')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSort('id')}>
                    Transaksi ID{renderSortArrow('id')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSort('pengguna_id')}>
                    Pengguna ID{renderSortArrow('pengguna_id')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSort('tanggal')}>
                    Tanggal{renderSortArrow('tanggal')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSort('status')}>
                    Status{renderSortArrow('status')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSort('via')}>
                    Via{renderSortArrow('via')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => requestSyort('total')}>
                    Total{renderSortArrow('total')}
                  </CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      <CSpinner className="mx-auto" />
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  paginatedTransactions.map((transaction, index) => (
                    <CTableRow key={transaction.id}>
                      <CTableDataCell>{currentPage * itemsPerPage + index + 1}</CTableDataCell>
                      <CTableDataCell>{transaction.id}</CTableDataCell>
                      <CTableDataCell>{transaction.pengguna_id}</CTableDataCell>
                      <CTableDataCell>{transaction.tanggal}</CTableDataCell>
                      <CTableDataCell>
                        <span
                          className={`p-1 rounded ${getStatusColor(transaction.status)}`}
                          style={{ fontSize: '14px', color: 'white' }}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>{transaction.via}</CTableDataCell>
                      <CTableDataCell>{renderHarga(transaction.total)}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`/transaction/${transaction.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Detail
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
            <div className="d-flex justify-content-center mt-3">
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
                nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakLinkClassName={'page-link'}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Online
