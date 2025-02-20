import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing
import axios from 'axios';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CListGroup,
    CListGroupItem
} from '@coreui/react';

const UserDetail = () => {
    const { id } = useParams(); // Get the user ID from the URL params
    const [user, setUser] = useState(null); // State to store user detail

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${id}`);
                setUser(response.data); // Update user state with fetched data
            } catch (error) {
                console.error('Error fetching user detail:', error);
            }
        };
        fetchUserDetail();
    }, [id]); // Fetch user detail when the component mounts and whenever the user ID changes

    return (
        <CRow className="justify-content-center">
            <CCol xs="12" sm="10" lg="8">
                <CCard>
                    <CCardHeader>
                        <h5 className="mb-0">Detail Pengguna</h5>
                    </CCardHeader>
                    <CCardBody>
                        {user ? (
                            <CListGroup>
                                <CListGroupItem>
                                    <strong>Username:</strong> {user.username}
                                </CListGroupItem>
                                <CListGroupItem>
                                    <strong>Email:</strong> {user.email}
                                </CListGroupItem>
                                <CListGroupItem>
                                    <strong>Name:</strong> {user.name}
                                </CListGroupItem>
                                <CListGroupItem>
                                    <strong>Phone Number:</strong> {user.phone_number}
                                </CListGroupItem>
                                <CListGroupItem>
                                    <strong>Address:</strong> {user.address}
                                </CListGroupItem>
                                <CListGroupItem>
                                    <strong>Role:</strong> {user.role}
                                </CListGroupItem>
                                {/* Add more user detail fields as needed */}
                            </CListGroup>
                        ) : (
                            <p>Loading user detail...</p>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default UserDetail;
