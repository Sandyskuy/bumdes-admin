import React, { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { CKEditor } from 'ckeditor4-react'
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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormLabel,
  CFormInput,
  CModalFooter,
} from '@coreui/react'

const News = () => {
  const [newsData, setNewsData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [judul, setJudul] = useState('')
  const [isi, setIsi] = useState('')
  const [gambar, setGambar] = useState(null)
  const [penulis, setPenulis] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('http://localhost:8080/berita/')
      setNewsData(response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNews = async () => {
    if (!judul || !isi || !penulis) {
      alert('Judul, Isi, and Penulis are required fields')
      return
    }

    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('isi', isi)
    formData.append('status', 'draft')
    formData.append('tanggal_publikasi', new Date().toISOString().split('T')[0])
    formData.append('penulis', penulis)
    if (gambar) formData.append('gambar', gambar)

    try {
      await axios.post('http://localhost:8080/berita/create', formData)
      fetchData()
      setVisibleCreate(false)
      resetForm()
    } catch (error) {
      console.error('Error creating news:', error)
    }
  }

  const handleEditNews = async () => {
    if (!judul || !isi || !penulis) {
      alert('Judul, Isi, and Penulis are required fields')
      return
    }

    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('isi', isi)
    formData.append('penulis', penulis)
    formData.append('status', 'draft')
    if (gambar) {
      formData.append('gambar', gambar)
    }

    try {
      await axios.post(`http://localhost:8080/berita/update/${selectedNews.id}`, formData)
      fetchData()
      setVisibleEdit(false)
      resetForm()
    } catch (error) {
      console.error('Error updating news:', error.response || error)
    }
  }

  const handleOpenEditModal = (news) => {
    setSelectedNews(news)
    setJudul(news.judul)
    setIsi(news.isi)
    setPenulis(news.penulis)
    setVisibleEdit(true)
  }

  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await axios.delete(`http://localhost:8080/berita/delete/${id}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting news:', error)
      }
    }
  }

  const resetForm = () => {
    setJudul('')
    setIsi('')
    setPenulis('')
    setGambar(null)
  }

  const handleEditorChange = useCallback((event) => {
    setIsi(event.editor.getData())
  }, [])

  const renderNewsTable = useMemo(() => {
    return newsData.map((news, index) => (
      <CTableRow key={news.id}>
        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
        <CTableDataCell>{news.judul}</CTableDataCell>
        <CTableDataCell dangerouslySetInnerHTML={{ __html: news.isi }} />
        <CTableDataCell dangerouslySetInnerHTML={{ __html: news.penulis }} />
        <CTableDataCell>
          <CButton
            onClick={() => handleOpenEditModal(news)}
            className="bg-warning mx-2"
            style={{ color: 'white' }}
          >
            Edit
          </CButton>
          <Link to={`/berita/detail/${news.id}`} className="btn btn-primary btn-sm">
            Detail
          </Link>
          <CButton
            onClick={() => handleDeleteNews(news.id)}
            className="bg-danger mx-2"
            style={{ color: 'white' }}
          >
            Delete
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ))
  }, [newsData])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">Daftar Berita</h5>
            <CButton
              className="bg-primary mt-2"
              style={{ color: 'white' }}
              onClick={() => setVisibleCreate(true)}
            >
              Tambah Berita
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Judul</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Isi</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Penulis</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading && <CSpinner className="mx-auto" />}
                {!isLoading && renderNewsTable}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal Tambah Berita */}
      <CModal visible={visibleCreate} onClose={() => setVisibleCreate(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Tambah Berita</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Judul</CFormLabel>
            <CFormInput type="text" value={judul} onChange={(e) => setJudul(e.target.value)} />
            <CFormLabel className="mt-2">Isi</CFormLabel>
            <CKEditor
              initData={isi}
              onChange={handleEditorChange}
              config={{ versionCheck: false }}
            />
            <CFormLabel className="mt-2">Penulis</CFormLabel>
            <CFormInput type="text" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
            <CFormLabel className="mt-2">Gambar</CFormLabel>
            <CFormInput type="file" onChange={(e) => setGambar(e.target.files[0])} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleCreate(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleCreateNews}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Edit Berita */}
      <CModal visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Berita</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Judul</CFormLabel>
            <CFormInput type="text" value={judul} onChange={(e) => setJudul(e.target.value)} />
            <CFormLabel className="mt-2">Isi</CFormLabel>
            <CKEditor
              initData={isi}
              onChange={handleEditorChange}
              config={{ versionCheck: false }}
            />
            <CFormLabel className="mt-2">Penulis</CFormLabel>
            <CFormInput type="text" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
            <CFormLabel className="mt-2">Gambar</CFormLabel>
            <CFormInput type="file" onChange={(e) => setGambar(e.target.files[0])} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleEditNews}>
            Simpan Perubahan
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default News
