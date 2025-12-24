import React, { useState } from 'react';
import { loadRazorpay } from '../utils/razorpay';
import axios from 'axios';

const PaymentGateway = ({ amount, bookingId, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Create order on backend
            const response = await axios.post('http://localhost:5000/api/payments/create-order', {
                booking_id: bookingId,
                amount: amount
            });

            const { data } = response.data;

            // Load Razorpay script
            await loadRazorpay();

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: 'Function Hall Booking',
                description: 'Hall Booking Payment',
                order_id: data.order_id,
                handler: async function(response) {
                    // Verify payment on backend
                    const verifyResponse = await axios.post('http://localhost:5000/api/payments/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyResponse.data.success) {
                        onSuccess(response);
                    } else {
                        onFailure('Payment verification failed');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#3B82F6'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment error:', error);
            onFailure('Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Secure Payment</h3>
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
            <p className="text-sm text-gray-600">
                Your payment is secured with 256-bit SSL encryption
            </p>
        </div>
    );
};

export default PaymentGateway;