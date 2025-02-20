import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
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
    CModalFooter
} from '@coreui/react';

const Users = () => {
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [adminData, setAdminData] = useState([]);
    const [superAdminData, setSuperAdminData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/admin/admin');
                const data = response.data;
                const admin = data.filter(item => item.role === 'admin');
                const superAdmin = data.filter(item => item.role === 'super_admin');
                setAdminData(admin);
                setSuperAdminData(superAdmin);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
        }
    }, []);

    if (!userRole || userRole !== 'super_admin') {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const EditModal = ({ user, visibleEdit, setVisibleEdit }) => {
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

        const handleSubmit = async () => {
            const url = `http://localhost:8080/admin/updateuser/${user.id}`;
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    id: user.id,
                    username: userUsername,
                    email: userEmail,
                    password: userPassword,
                    phone_number: userPhone,
                    name: userName,
                    address: userAddress
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                alert('Success updating user');
                window.location.reload();
            } else {
                alert(response.statusText);
                window.location.reload();
            }
        };

        return (
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
                                required
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
                                required
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
                                required
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
                                required
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
        );
    };

    const handleShowEditModal = (item) => {
        setSelectedUser(item);
        setVisibleEdit(true);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h5 className="mb-0">Super Admin Data</h5>
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
                                {isLoading && <CSpinner className='mx-auto' />}
                                {!isLoading && superAdminData.map((item, index) => (
                                    <CTableRow key={index}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{item.username}</CTableDataCell>
                                        <CTableDataCell>{item.email}</CTableDataCell>
                                        <CTableDataCell>{item.role}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton onClick={() => handleShowEditModal(item)} className='bg-warning mx-2' style={{ color: 'white' }}>Edit</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h5 className="mb-0">Admin Data</h5>
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
                                {isLoading && <CSpinner className='mx-auto' />}
                                {!isLoading && adminData.map((item, index) => (
                                    <CTableRow key={index}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{item.username}</CTableDataCell>
                                        <CTableDataCell>{item.email}</CTableDataCell>
                                        <CTableDataCell>{item.role}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton onClick={() => handleShowEditModal(item)} className='bg-warning mx-2' style={{ color: 'white' }}>Edit</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            {selectedUser && (
                <EditModal user={selectedUser} visibleEdit={visibleEdit} setVisibleEdit={setVisibleEdit} />
            )}
        </CRow>
    );
};

export default Users;
