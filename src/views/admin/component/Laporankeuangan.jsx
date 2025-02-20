import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';

const FinancialReportTable = () => {
  const [laporanKeuangan, setLaporanKeuangan] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedVia, setSelectedVia] = useState(null);

  useEffect(() => {
    fetchLaporanKeuangan();
  }, [selectedMonth, selectedYear, selectedVia]);

  const fetchLaporanKeuangan = async () => {
    try {
      let url = `http://localhost:8080/laporan-keuangan/${selectedMonth}/${selectedYear}`;
      if (selectedVia) url += `/${selectedVia}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLaporanKeuangan(data.laporan);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleViaChange = (value) => {
    setSelectedVia(value);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div>
      <h2>Laporan Keuangan</h2>
      <div className="dropdown-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <CDropdown className="month-dropdown">
          <CDropdownToggle color="secondary">
            {months.find((month) => month.value === selectedMonth)?.label || 'Select Month'}
          </CDropdownToggle>
          <CDropdownMenu>
            {months.map((month) => (
              <CDropdownItem key={month.value} onClick={() => handleMonthChange(month.value)}>
                {month.label}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>

        <CDropdown className="year-dropdown">
          <CDropdownToggle color="secondary">
            {selectedYear || 'Select Year'}
          </CDropdownToggle>
          <CDropdownMenu>
            {years.map((year) => (
              <CDropdownItem key={year} onClick={() => handleYearChange(year)}>
                {year}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>

        <CDropdown className="via-dropdown">
          <CDropdownToggle color="secondary">
            {selectedVia === null ? 'All' : selectedVia.charAt(0).toUpperCase() + selectedVia.slice(1)}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => handleViaChange(null)}>All</CDropdownItem>
            <CDropdownItem onClick={() => handleViaChange('offline')}>Offline</CDropdownItem>
            <CDropdownItem onClick={() => handleViaChange('online')}>Online</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable striped bordered hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Tanggal</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
            <CTableHeaderCell>Via</CTableHeaderCell>
            <CTableHeaderCell>Stok Dibeli</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {laporanKeuangan.map((laporan, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{laporan.id}</CTableDataCell>
              <CTableDataCell>{laporan.tanggal}</CTableDataCell>
              <CTableDataCell>{laporan.total}</CTableDataCell>
              <CTableDataCell>{laporan.via}</CTableDataCell>
              <CTableDataCell>
                <ul>
                  {Object.keys(laporan.stok_dibeli).map((barangId) => (
                    <li key={barangId}>
                      {laporan.stok_dibeli[barangId].nama}: {laporan.stok_dibeli[barangId].jumlah}
                    </li>
                  ))}
                </ul>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default FinancialReportTable;
