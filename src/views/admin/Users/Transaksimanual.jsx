import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CButton, CCard, CCardBody, CTable, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CFormSelect, CFormInput, CFormLabel } from '@coreui/react';
import axios from 'axios';

function App() {
  const [barangList, setBarangList] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchBarangList = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/barang`);
      setBarangList(response.data);
    } catch (error) {
      console.error('Error fetching barang list:', error);
    }
  };

  useEffect(() => {
    fetchBarangList();
  }, []);

  const handleSelectBarang = (barang) => {
    setSelectedBarang(barang);
  };

  const handleChangeQuantity = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (selectedBarang) {
      setCart([...cart, { ...selectedBarang, quantity }]);
      setSelectedBarang(null);
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:8080/transaksi/transaksimanual', {
        barang_ids: cart.map(item => item.id),
        quantities: cart.map(item => item.quantity),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Transaction successful');
      setCart([]);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Transaction failed');
    }
  };

  return (
    <CContainer>
      <CRow>
        <CCol>
          <h1>Transaksi Manual</h1>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <h3>Pilih Barang:</h3>
                  <CFormSelect custom onChange={(e) => handleSelectBarang(JSON.parse(e.target.value))}>
                    <option value="">Pilih Barang</option>
                    {barangList.map((barang, index) => (
                      <option key={index} value={JSON.stringify(barang)}>{barang.id} - {barang.nama}</option>
                    ))}
                  </CFormSelect>
                  {selectedBarang && (
                    <div>
                      <CFormInput 
                        type="text" 
                        value={selectedBarang.nama} 
                        readOnly 
                        className="mt-3" 
                        style={{ color: 'grey' }} 
                      />
                      <CFormInput 
                        type="text" 
                        value={`Harga: ${selectedBarang.harga}`} 
                        readOnly 
                        className="mt-3" 
                        style={{ color: 'grey' }} 
                      />
                      <CFormInput 
                        type="text" 
                        value={`Stok: ${selectedBarang.stok}`} 
                        readOnly 
                        className="mt-3" 
                        style={{ color: 'grey' }} 
                      />
                      <CFormLabel className="mt-3">Jumlah</CFormLabel> {/* Label Jumlah */}
                      <CFormInput type="number" value={quantity} onChange={handleChangeQuantity} className="mt-1"/> {/* Input Quantity */}
                      <CButton color="success" onClick={handleAddToCart} className="mt-3">Add to Cart</CButton>
                    </div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CTable>
            <thead>
              <tr>
                <CTableHeaderCell>Barang ID</CTableHeaderCell>
                <CTableHeaderCell>Nama</CTableHeaderCell>
                <CTableHeaderCell>Harga</CTableHeaderCell>
                <CTableHeaderCell>Jumlah</CTableHeaderCell>
                <CTableHeaderCell>Aksi</CTableHeaderCell> {/* Tambah kolom Action */}
              </tr>
            </thead>
            <CTableBody>
              {cart.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.nama}</CTableDataCell>
                  <CTableDataCell>{item.harga}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" onClick={() => handleRemoveFromCart(index)} style={{color: 'white'}}>Remove</CButton> {/* Button untuk menghapus item dari keranjang */}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {cart.length > 0 && (
            <CButton color="primary" onClick={handlePayment}>Pay</CButton>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default App;
