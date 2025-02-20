import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner, CAlert } from '@coreui/react';
import { saveAs } from 'file-saver';

const PaymentProofPage = () => {
    const { id } = useParams(); // Get transaction ID from URL params
    const [paymentProof, setPaymentProof] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        const fetchPaymentProof = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/bukti/show/${id}`);
                setPaymentProof(response.data);
            } catch (error) {
                console.error('Error fetching payment proof:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaymentProof();
    }, [id]);

    const confirmPayment = async () => {
        setConfirming(true);
        try {
            const response = await axios.post(`http://localhost:8080/bukti/confirm/${paymentProof.id}`);
            setConfirmationMessage(response.data.message);
            // Update status locally
            setPaymentProof((prev) => ({ ...prev, status: 1 }));
        } catch (error) {
            console.error('Error confirming payment:', error);
            setConfirmationMessage('Error confirming payment');
        } finally {
            setConfirming(false);
        }
    };

    const downloadImage = () => {
        saveAs(`http://localhost:8080/uploads/${paymentProof.bukti_pembayaran}`, 'payment-proof.jpg');
    };

    if (isLoading) {
        return (
            <CRow className="justify-content-center mt-4">
                <CCol xs="auto">
                    <CSpinner color="primary" />
                </CCol>
            </CRow>
        );
    }

    return (
        <CRow>
            <CCol>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h5 className="mb-0">Bukti Pembayaran</h5>
                    </CCardHeader>
                    <CCardBody>
                        {paymentProof ? (
                            <CRow className="align-items-center">
                                <CCol xs="auto">
                                    <img
                                        src={`http://localhost:8080/uploads/${paymentProof.bukti_pembayaran}`}
                                        alt="Bukti Pembayaran"
                                        style={{ maxWidth: '300px', height: '350px' }}
                                    />
                                </CCol>
                                <CCol>
                                    <div>
                                        <p><strong>Transaksi ID:</strong> {paymentProof.transaksi_id}</p>
                                        <p><strong>Status:</strong> {paymentProof.status == 1 ? 'Terkonfirmasi' : 'Menunggu Konfirmasi'}</p>
                                        {paymentProof.status == 0 ? (
                                            <CButton color="primary" onClick={confirmPayment} disabled={confirming}>
                                                {confirming ? 'Mengkonfirmasi...' : 'Konfirmasi Pembayaran'}
                                            </CButton>
                                        ) : (
                                            <CAlert color="success">
                                                Pembayaran telah dikonfirmasi
                                            </CAlert>
                                        )}
                                        <div className="mt-2">
                                            <CButton color="primary" onClick={() => window.history.back()}>Kembali</CButton>
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>
                        ) : (
                            <p>Tidak ada bukti pembayaran ditemukan dengan ID: {id}</p>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default PaymentProofPage;
