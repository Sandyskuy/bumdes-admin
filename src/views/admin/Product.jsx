import React, { useEffect, useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import debounce from 'lodash.debounce'
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CCardImage,
  CInputGroup,
  CTableDataCell,
} from '@coreui/react'

const Product = () => {
  const [visible, setVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [visibleCategory, setVisibleCategory] = useState(false)

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [categories, setCategories] = useState([])
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)
  const [category, setCategory] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  const [name, setName] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [harga, setHarga] = useState('')
  const [hargaKulak, setHargaKulak] = useState('')
  const [gambar, setGambar] = useState(null)
  const [gambarPreview, setGambarPreview] = useState(null)
  const [stok, setStok] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('http://localhost:8080/barang')
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    setIsLoadingCategory(true)
    try {
      const response = await axios.get('http://localhost:8080/kategori')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Failed to fetch categories')
    } finally {
      setIsLoadingCategory(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGambar(file)
      setGambarPreview(URL.createObjectURL(file))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/barang/deletebarang/${id}`)
        alert(response.data.message)
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Terjadi kesalahan saat menghapus produk')
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('nama', name)
      formData.append('deskripsi', deskripsi)
      formData.append('harga', harga)
      formData.append('harga_kulak', hargaKulak)
      formData.append('kategori_id', category)
      formData.append('gambar', gambar)
      formData.append('stok', stok)

      const response = await axios.post('http://localhost:8080/barang/postbarang', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Product added successfully')
      resetForm()
      fetchData()
      setVisible(false)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Terjadi kesalahan saat menambahkan produk')
    }
  }

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData()

      // Menambahkan field yang lain
      formData.append('nama', name)
      formData.append('deskripsi', deskripsi)
      formData.append('harga', harga)
      formData.append('harga_kulak', hargaKulak)
      formData.append('kategori_id', category)
      formData.append('stok', stok)

      // Jika gambar baru dipilih, tambahkan gambar baru ke FormData
      if (gambar) {
        formData.append('gambar', gambar)
      }

      const response = await axios.post(
        `http://localhost:8080/barang/updatebarang/${selectedProduct.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      alert(response.data.message)
      fetchData()
      setVisible(false)
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Terjadi kesalahan saat mengupdate produk')
    }
  }

  const handleShowEditModal = (item) => {
    setVisible(true)
    setSelectedProduct(item)
    setName(item.nama)
    setDeskripsi(item.deskripsi)
    setHarga(item.harga)
    setHargaKulak(item.harga_kulak)
    setCategory(item.kategori_id)
    setStok(item.stok)
  }

  const handleAddCategory = () => {
    setVisibleCategory(true)
  }

  const handleAddNewCategory = async () => {
    try {
      const response = await axios.post('http://localhost:8080/kategori/postkategori', {
        nama: newCategoryName,
      })

      alert('Category added successfully')
      setNewCategoryName('')
      fetchCategories()
      setVisibleCategory(false)
    } catch (error) {
      console.error('Error adding new category:', error)
      alert('Terjadi kesalahan saat menambahkan kategori baru')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/kategori/deletekategori/${id}`)
        alert('Category deleted successfully')
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Terjadi kesalahan saat menghapus kategori')
      }
    }
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value
    setSelectedCategory(selectedValue === 'null' ? null : selectedValue)
  }

  const resetForm = () => {
    setName('')
    setDeskripsi('')
    setHarga('')
    setHargaKulak('')
    setCategory('')
    setGambar(null)
    setGambarPreview(null)
    setStok(0)
  }

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query)
    }, 300),
    [],
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    debouncedSearch(value)
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

  // Memodifikasi fungsi sortedData untuk melakukan sorting ascending atau descending
  const sortedData = useMemo(() => {
    let sortableItems = [...data]
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (sortConfig.direction === 'ascending') {
          return valA - valB // Urutan ascending, data terkecil ke terbesar
        } else {
          return valB - valA // Urutan descending, data terbesar ke terkecil
        }
      })
    }
    return sortableItems
  }, [data, sortConfig])

  const filteredData = sortedData.filter(
    (item) =>
      (selectedCategory === null || item.kategori_id === selectedCategory) &&
      (item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )
  const pageCount = Math.ceil(filteredData.length / itemsPerPage) // menggunakan filteredData

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>Produk</strong>
            </CCardHeader>
            <CCardBody>
              <CButton onClick={() => setVisible(true)} color="primary">
                Tambah Produk
              </CButton>
              <CButton onClick={handleAddCategory} color="primary" className="ms-2">
                Tambah Kategori
              </CButton>
              <CInputGroup className="mt-3 mb-3">
                <CFormInput placeholder="Cari Produk..." onChange={handleSearchChange} />
              </CInputGroup>
              <CFormSelect
                className="mb-3"
                aria-label="Pilih Kategori"
                onChange={handleCategoryChange}
              >
                <option value="null">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </CFormSelect>
              {isLoading ? (
                <CSpinner />
              ) : (
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Gambar</CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('nama')}>
                        Nama{' '}
                        {sortConfig.key === 'nama' &&
                          (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('deskripsi')}>
                        Deskripsi{' '}
                        {sortConfig.key === 'deskripsi' &&
                          (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('harga')}>
                        Harga{' '}
                        {sortConfig.key === 'harga' &&
                          (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('harga_kulak')}>
                        Harga Kulak
                        {sortConfig.key === 'harga' &&
                          (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('stok')}>
                        Stok{' '}
                        {sortConfig.key === 'stok' &&
                          (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paginatedData.map((item, index) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableHeaderCell scope="row">
                          <CCardImage
                            height={100}
                            width={100}
                            src={'http://localhost:8080/uploads/' + item.gambar}
                            style={{ objectFit: 'cover' }}
                          />
                        </CTableHeaderCell>
                        <CTableDataCell>{item.nama}</CTableDataCell>
                        <CTableDataCell>{item.deskripsi}</CTableDataCell>
                        <CTableDataCell>{renderHarga(item.harga)}</CTableDataCell>
                        <CTableDataCell>{renderHarga(item.harga_kulak)}</CTableDataCell>
                        <CTableDataCell>{item.stok}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" onClick={() => handleShowEditModal(item)}>
                            Edit
                          </CButton>
                          <CButton
                            color="danger"
                            className="ms-2"
                            style={{ color: 'white' }}
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
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

      {/* Modal for Add/Edit Product */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{selectedProduct ? 'Edit Produk' : 'Tambah Produk'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Nama Produk</CFormLabel>
            <CFormInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <CFormLabel className="mt-2">Deskripsi Produk</CFormLabel>
            <CFormTextarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
            <CFormLabel className="mt-2">Harga Produk</CFormLabel>
            <CFormInput type="number" value={harga} onChange={(e) => setHarga(e.target.value)} />
            <CFormLabel className="mt-2">Harga Kulak</CFormLabel>
            <CFormInput
              type="number"
              value={hargaKulak}
              onChange={(e) => setHargaKulak(e.target.value)}
            />
            <CFormLabel className="mt-2">Kategori</CFormLabel>
            <CFormSelect value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel className="mt-2">Gambar Produk</CFormLabel>
            <CFormInput type="file" onChange={handleFileChange} />
            {gambarPreview && (
              <div className="mt-2">
                <CCardImage orientation="top" src={gambarPreview} alt="Gambar Produk" />
              </div>
            )}
            <CFormLabel className="mt-2">Stok Produk</CFormLabel>
            <CFormInput type="number" value={stok} onChange={(e) => setStok(e.target.value)} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={selectedProduct ? handleEditSubmit : handleSubmit}>
            {selectedProduct ? 'Update' : 'Submit'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal backdrop="static" visible={visibleCategory} onClose={() => setVisibleCategory(false)}>
        <CModalHeader closeButton>
          <CModalTitle>List Kategori</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {isLoadingCategory ? (
            <CSpinner className="mx-auto"></CSpinner>
          ) : (
            <div>
              <ul className="list-group">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {category.nama}

                    <CButton
                      onClick={() => handleDeleteCategory(category.id)}
                      color="danger"
                      size="sm"
                      className="ms-2"
                    >
                      Hapus
                    </CButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Form untuk menambah kategori */}
          <CForm className="mt-3">
            <div className="mb-3">
              <CFormLabel htmlFor="newCategoryName">Tambah Kategori Baru</CFormLabel>
              <CInputGroup>
                <CFormInput
                  type="text"
                  id="newCategoryName"
                  placeholder="Nama Kategori Baru"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <CButton color="primary" onClick={handleAddNewCategory}>
                  Tambah
                </CButton>
              </CInputGroup>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleCategory(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Product
