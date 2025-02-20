import React, { useEffect, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { CCard,
  CCardBody,
  CCardHeader, 
  CButton, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell} from '@coreui/react';
  import {
    cilBell,
    cilCalculator,
    cilChartPie,
    cilChatBubble,
    cilList,
    cilDescription,
    cilDrop,
    cilInbox,
    cilMoney,
    cilNotes,
    cilPencil,
    cilPuzzle,
    cilReportSlash,
    cilSpeedometer,
    cilStar,
    cilTransfer,
    cilUser,
    cilCheckAlt,
    cilPeople
  } from '@coreui/icons';
import axios from 'axios';

const ConfirmStockPage = () => {
  const [transaksiList, setTransaksiList] = useState([]);

  useEffect(() => {
    fetchTransaksiList();
  }, []);

  const fetchTransaksiList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/transaksi/pending-stock'); // Ganti dengan endpoint API Anda
      const filteredTransaksi = response.data.filter(transaksi => !transaksi.stok_diterima);
      setTransaksiList(filteredTransaksi);
    } catch (error) {
      console.error('Error fetching transaksi data:', error);
    }
  };

  const confirmStock = async (transaksi_id) => {
    try {
      await axios.put(`http://localhost:8080/transaksi/confirm/${transaksi_id}`);
      fetchTransaksiList(); // Refresh the list after confirming stock
    } catch (error) {
      console.error('Error confirming stock:', error);
    }
  };

  const formatRupiah = (angka) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
    return formatter.format(angka);
  };

  const renderHarga = (harga) => {
    return formatRupiah(harga);
  };

  return (
    <CCard>
      <CCardHeader>
        <h3>Konfirmasi Stok Diterima</h3>
      </CCardHeader>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID Transaksi</CTableHeaderCell>
              <CTableHeaderCell>Pengguna</CTableHeaderCell>
              <CTableHeaderCell>Tanggal</CTableHeaderCell>
              <CTableHeaderCell>Total</CTableHeaderCell>
              <CTableHeaderCell>Barang</CTableHeaderCell>
              <CTableHeaderCell>Aksi</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {transaksiList.map(transaksi => (
              <CTableRow key={transaksi.id}>
                <CTableDataCell>{transaksi.id}</CTableDataCell>
                <CTableDataCell>{transaksi.username}</CTableDataCell>
                <CTableDataCell>{transaksi.tanggal}</CTableDataCell>
                <CTableDataCell>{renderHarga(transaksi.total)}</CTableDataCell>
                <CTableDataCell>
                      {transaksi.stok_dibeli && Object.entries(transaksi.stok_dibeli).map(([barangId, dataBarang], idx) => (
                        <div key={idx}>{dataBarang.nama}, ({dataBarang.jumlah})</div>
                      ))}
                    </CTableDataCell>
                <CTableDataCell>
                <CButton color="success" onClick={() => confirmStock(transaksi.id)} style={{ color: 'white' }}> 
                Konfirmasi
                </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default ConfirmStockPage;
