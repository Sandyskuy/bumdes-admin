import React, { useEffect, useState } from 'react'
import axios from 'axios'; // Assuming you have Axios installed
import { Link } from 'react-router-dom'; // Import Link from React Router
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
    CTableRow
} from '@coreui/react'

const Users = () => {
    const [visible, setVisible] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)

    const [data, setData] = useState([]); // State to store fetched data
    const [isLoading, setIsLoading] = useState(false); // State to indicate loading status

    const [itemsPerPage] = useState(10); // Adjust as needed
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);




    const handleDelete = async (id) => {
        const isDelete = confirm("Yakin ingin menghapus data ini ? ")
        if (isDelete) {
            const url = `http://localhost:8080/admin/deleteuser/${id}`;
            try {
                const response = await axios.delete(url);
                alert(response.data.message);
                location.reload();
            } catch (error) {
                alert("Error deleting user.");
                console.error("Error deleting user:", error);
            }
        }
    }


useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true); // Set loading to true before fetching
        try {
            const response = await axios.get('http://localhost:8080/users'); // Fetch data from API
            setData(response.data); // Update data state
        } catch (error) {
            console.error('Error fetching data:', error); // Handle errors gracefully
        } finally {
            setIsLoading(false); // Set loading to false after fetching (important)
        }
    };
    fetchData();
}, []);

const pageCount = Math.ceil(data.length / itemsPerPage);

const indexOfLastItem = (currentPage + 1) * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const paginatedData = data.slice(indexOfFirstItem, indexOfLastItem);

const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
};

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                    <CCardHeader>
                        <h5 className="mb-0">User Data</h5>
                    </CCardHeader>
                        <CCardBody>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Jabatan</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {isLoading && <CSpinner className='mx-auto'></CSpinner>}
                                {!isLoading && (
                                    <>
                                        {paginatedData.map((item, index) => (
                                            <CTableRow key={index}>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item.username}</CTableDataCell>
                                                <CTableDataCell>{item.email}</CTableDataCell>
                                                <CTableDataCell>{item.role}</CTableDataCell>
                                                <CTableDataCell>
                                                    <Link to={`/users/${item.id}`} className='btn btn-primary mx-2'>Detail</Link>
                                                    <CButton onClick={() => handleDelete(item.id)} className='bg-danger'>Hapus</CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </>
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
        </>
    )
}




export default Users
