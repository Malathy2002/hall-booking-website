const db = require('../config/db');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentController {
    // Create payment order
    async createPaymentOrder(req, res) {
        try {
            const { booking_id, amount } = req.body;

            // Verify booking
            const [booking] = await db.query(`
                SELECT b.*, h.hall_name 
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                WHERE b.booking_id = ? AND b.customer_id = ?
            `, [booking_id, req.user.id]);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            // Generate order ID
            const orderId = 'order_' + Date.now();

            const options = {
                amount: amount * 100, // in paise
                currency: 'INR',
                receipt: orderId,
                notes: {
                    booking_id: booking_id.toString(),
                    customer_id: req.user.id.toString()
                }
            };

            const order = await razorpay.orders.create(options);

            // Save payment record
            await db.query(`
                INSERT INTO payments (
                    booking_id, order_id, amount, 
                    payment_method, payment_status, currency
                ) VALUES (?, ?, ?, 'online', 'pending', ?)
            `, [booking_id, order.id, amount, options.currency]);

            res.json({
                success: true,
                data: {
                    order_id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: process.env.RAZORPAY_KEY_ID
                }
            });

        } catch (error) {
            console.error('Create payment order error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating payment order'
            });
        }
    }

    // Verify payment
    async verifyPayment(req, res) {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            } = req.body;

            // Verify signature
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            const isAuthentic = expectedSignature === razorpay_signature;

            if (!isAuthentic) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment verification failed'
                });
            }

            // Update payment status
            await db.query(`
                UPDATE payments 
                SET payment_id = ?, 
                    payment_status = 'completed',
                    payment_date = NOW(),
                    gateway_response = ?
                WHERE order_id = ?
            `, [razorpay_payment_id, JSON.stringify(req.body), razorpay_order_id]);

            // Get booking ID from payment
            const [payment] = await db.query(
                'SELECT booking_id FROM payments WHERE order_id = ?',
                [razorpay_order_id]
            );

            if (payment && payment.booking_id) {
                // Update booking status
                await db.query(`
                    UPDATE bookings 
                    SET booking_status = 'confirmed',
                        payment_status = 'paid'
                    WHERE booking_id = ?
                `, [payment.booking_id]);

                // Send confirmation email
                await this.sendPaymentConfirmation(payment.booking_id);
            }

            res.json({
                success: true,
                message: 'Payment verified successfully'
            });

        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Error verifying payment'
            });
        }
    }

    // Get payment history
    async getPaymentHistory(req, res) {
        try {
            const userId = req.user.id;

            const payments = await db.query(`
                SELECT p.*, b.booking_reference, h.hall_name
                FROM payments p
                JOIN bookings b ON p.booking_id = b.booking_id
                JOIN halls h ON b.hall_id = h.hall_id
                WHERE b.customer_id = ?
                ORDER BY p.payment_date DESC
            `, [userId]);

            res.json({
                success: true,
                data: payments
            });

        } catch (error) {
            console.error('Get payment history error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching payment history'
            });
        }
    }

    // Send payment confirmation
    async sendPaymentConfirmation(bookingId) {
        try {
            const [booking] = await db.query(`
                SELECT b.*, u.email, u.name, h.hall_name
                FROM bookings b
                JOIN users u ON b.customer_id = u.user_id
                JOIN halls h ON b.hall_id = h.hall_id
                WHERE b.booking_id = ?
            `, [bookingId]);

            if (booking) {
                // Send email
                await sendEmail({
                    to: booking.email,
                    subject: 'Payment Confirmed - Function Hall Booking',
                    template: 'payment-confirmation',
                    context: {
                        customer_name: booking.name,
                        hall_name: booking.hall_name,
                        amount: booking.total_amount,
                        booking_reference: booking.booking_reference
                    }
                });
            }
        } catch (error) {
            console.error('Send confirmation error:', error);
        }
    }
}

module.exports = new PaymentController();