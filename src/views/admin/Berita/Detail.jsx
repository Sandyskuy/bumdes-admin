import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CKEditor } from 'ckeditor4-react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
  CCardFooter,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const DetailNews = () => {
  const { id } = useParams() // Extract news ID from the URL
  const [newsDetail, setNewsDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleEdit, setVisibleEdit] = useState(false) // To control modal visibility
  const [judul, setJudul] = useState('')
  const [isi, setIsi] = useState('')
  const [penulis, setPenulis] = useState('')
  const [gambar, setGambar] = useState(null)

  const fetchNewsDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/berita/detail/${id}`)
      setNewsDetail(response.data)
      setJudul(response.data.judul)
      setIsi(response.data.isi)
      setPenulis(response.data.penulis)
    } catch (error) {
      console.error('Error fetching news detail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsDetail()
  }, [id])

  if (isLoading) {
    return (
      <CRow className="justify-content-center">
        <CCol xs="auto">
          <CSpinner color="primary" />
        </CCol>
      </CRow>
    )
  }

  if (!newsDetail) {
    return <div>News not found</div>
  }

  const {
    judul: newsJudul,
    isi: newsIsi,
    penulis: newsPenulis,
    tanggal_publikasi,
    gambar: newsGambar,
  } = newsDetail

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
      await axios.post(`http://localhost:8080/berita/update/${id}`, formData)
      setVisibleEdit(false) // Close the modal
      fetchNewsDetail() // Refresh the news details
    } catch (error) {
      console.error('Error updating news:', error.response || error)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="bg-dark text-white">
              <CCardTitle>{newsJudul}</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                {/* Content Section */}
                <CCol xs={12} md={8}>
                  <CCardText>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: newsIsi,
                      }}
                    />
                  </CCardText>
                </CCol>

                {/* Image Section */}
                <CCol xs={12} md={4}>
                  {newsGambar && (
                    <CImage
                      src={`http://localhost:8080/uploads/${newsGambar}`}
                      alt={newsJudul}
                      className="img-fluid rounded"
                    />
                  )}
                </CCol>
              </CRow>

              {/* Meta Data Section */}
              <CCardText>
                <strong>Penulis:</strong> {newsPenulis}
              </CCardText>
              <CCardText>
                <strong>Tanggal Publikasi:</strong> {tanggal_publikasi}
              </CCardText>
            </CCardBody>
            <CCardFooter>
              <CButton color="secondary" onClick={() => window.history.back()}>
                Kembali
              </CButton>
              <CButton color="primary" onClick={() => setVisibleEdit(true)}>
                Edit
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      {/* Edit Modal */}
      <CModal visible={visibleEdit} onClose={() => setVisibleEdit(false)} color="primary">
        <CModalHeader closeButton>
          <h5>Edit News</h5>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="judul">Judul</CFormLabel>
            <CFormInput
              type="text"
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="mb-3"
            />

            <CFormLabel htmlFor="isi">Isi</CFormLabel>
            <CKEditor
              initData={isi}
              onChange={(event) => setIsi(event.editor.getData())}
              config={{ versionCheck: false }}
            />

            <CFormLabel htmlFor="penulis">Penulis</CFormLabel>
            <CFormInput
              type="text"
              id="penulis"
              value={penulis}
              onChange={(e) => setPenulis(e.target.value)}
              className="mb-3"
            />

            <CFormLabel htmlFor="gambar">Gambar</CFormLabel>
            <CFormInput
              type="file"
              id="gambar"
              onChange={(e) => setGambar(e.target.files[0])}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleEditNews}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default DetailNews
