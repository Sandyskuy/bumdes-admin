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
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CRow,
    CSpinner,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModalTitle,
    CForm,
    CFormLabel,
    CFormInput,
    CFormTextarea
} from '@coreui/react'

const Staff = () => {
    const [visible, setVisible] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)

    const [data, setData] = useState([]); // State to store fetched data
    const [isLoading, setIsLoading] = useState(false); // State to indicate loading status

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // You can adjust this value as needed
    const [selectedUser, setSelectedUser] = useState(null);



    const handleDelete = async (id) => {
        const isDelete = confirm("Yakin ingin menghapus data ini ? ")
        if (isDelete) {
            const url = `http://localhost:8080/admin/deleteuser/${id}`;
            try {
                const response = await axios.delete(url);
                alert(response.data.message);
                fetchData();
            } catch (error) {
                alert("Error deleting user.");
                console.error("Error deleting user:", error);
            }
        }
    }
    
    


    const EditModal = ({ user }) => {
        const [userEmail, setUserEmail] = useState('');
        const [userUsername, setUserUsername] = useState('');
        const [userPassword, setUserPassword] = useState('');

        const [userPhone, setUserPhone] = useState('');
        const [userName, setUserName] = useState('');
        const [userAddress, setUserAddress] = useState('');

        useEffect(() => {
            if (user) {
                setUserEmail(user.email || '');
                setUserUsername(user.username || '');
                setUserPassword(user.password || '');
                setUserPhone(user.phone_number || '');
                setUserName(user.name || '');
                setUserAddress(user.address || '');
            }
        }, [user]);

        console.log(JSON.stringify({
            username: userUsername,
            email: userEmail,
            password: userPassword,
            phone_number: userPhone,
            name: userName,
            address: userAddress
        }))
        const handleSubmit = async () => {
            let url = `http://localhost:8080/admin/updateuser/${user.id}`;
            var response = await fetch(url, {
                method: 'put',
                body: JSON.stringify({
                    id: user.id,
                    username: userUsername,
                    email: userEmail,
                    password: userPassword,
                    phone_number: userPhone,
                    name: userName,
                    address: userAddress
                },
                ),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                alert('success update user');
                location.reload()
            } else {
                alert(response.statusText);
                location.reload()
            }
        }

        return (
            <>
                <CModal backdrop="static" visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
                    <CModalHeader>
                        <CModalTitle>Edit</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                <CFormInput
                                    type="email"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    required={true}


                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="username">Username</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="username"
                                    placeholder="username"
                                    value={userUsername}
                                    onChange={(e) => setUserUsername(e.target.value)}
                                    required={true}


                                />
                                </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="password">Password</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    required={true}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="name">Nama</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="name"
                                    placeholder="Nama"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required={false}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="phone_number">Nomor Telepon</CFormLabel>
                                <CFormInput
                                    type="number"
                                    id="phone_number"
                                    placeholder="Nomor Telepon"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    required={true}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="address">Alamat</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="address"
                                    placeholder="Alamat"
                                    value={userAddress}
                                    onChange={(e) => setUserAddress(e.target.value)}
                                    required={false}
                                />
                            </div>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
                            Tutup
                        </CButton>
                        <CButton color="primary" onClick={handleSubmit}>
                            Simpan
                        </CButton>
                    </CModalFooter>
                </CModal>
            </>
        );
    }

    const handleShowEditModal = (item) => {
        setVisibleEdit(true);

        setSelectedUser(item);
    }

useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true); // Set loading to true before fetching
        try {
            const response = await axios.get('http://localhost:8080/admin/staff'); // Fetch data from API
            setData(response.data); // Update data state
        } catch (error) {
            console.error('Error fetching data:', error); // Handle errors gracefully
        } finally {
            setIsLoading(false); // Set loading to false after fetching (important)
        }
    };
    fetchData();
}, []);




    const AddAdmin = () => {

        const [email, setEmail] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [phone_number, setPhone] = useState('');
        const [name, setName] = useState('');
        const [address, setAddress] = useState('');


const handleSubmit = async () => {
    try {
        // Definisikan userData sesuai dengan nilai-nilai yang telah Anda terima dari input pengguna
        const userData = {
            email: email,
            username: username,
            password: password,
            phone_number: phone_number,
            name: name,
            address: address
        };

        // Lakukan permintaan untuk menambahkan admin ke server.
        const response = await axios.post('http://localhost:8080/admin/postuser', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Admin added successfully!', response.data); // Access response data if needed
        alert(response.data.message);
        setVisible(false); // Close modal after success
        location.reload();

    } catch (error) {
        alert(error.message);
        // Handle errors (including CORS errors)
        console.error('Error adding admin:', error);
        // Display user-friendly error message (optional)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server error:', error.response.data);
            // You can display a more specific message based on the error code
        } else if (error.request) {
            // The request was made but no response was received
            // error.request is an instance of XMLHttpRequest in browser environments
            console.error('Network error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
    }
};




        return (
            <>
        <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
                <CModalTitle>Tambah User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">Email</CFormLabel>
                        <CFormInput
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel htmlFor="username">Username</CFormLabel>
                        <CFormInput
                            type="text"
                            id="username"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel htmlFor="password">Password</CFormLabel>
                        <CFormInput
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel htmlFor="phone_number">Nomor Telepon</CFormLabel>
                        <CFormInput
                            type="tel"
                            id="phone"
                            placeholder="Phone Number"
                            value={phone_number}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel htmlFor="name">Nama</CFormLabel>
                        <CFormInput
                            type="text"
                            id="name"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormLabel htmlFor="address">Alamat</CFormLabel>
                        <CFormTextarea
                            id="address"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Tutup
                </CButton>
                <CButton color="primary" onClick={handleSubmit}>
                    Simpan
                </CButton>
            </CModalFooter>
        </CModal>
            </>
        );
    };

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
                            <CButton color="primary" onClick={() => setVisible(!visible)}>
                                Tambah Staff
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <p className="text-body-secondary small">
                            </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
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
                                                <CTableDataCell>{item.name}</CTableDataCell>
                                                <CTableDataCell>{item.username}</CTableDataCell>
                                                <CTableDataCell>{item.email}</CTableDataCell>
                                                <CTableDataCell>{item.role}</CTableDataCell>
                                                <CTableDataCell>
                                                <Link to={`/users/${item.id}`} className='btn btn-primary'>Detail</Link>
                                                    <CButton onClick={() => { handleShowEditModal(item) }} className='bg-warning mx-2' style={{ color: 'white' }}>Edit</CButton>
                                                    <CButton onClick={() => handleDelete(item.id)} className='bg-danger' style={{ color: 'white' }}>Hapus</CButton>
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
            <AddAdmin>  </AddAdmin>
            <EditModal user={selectedUser} />
        </>
    )
}




export default Staff;