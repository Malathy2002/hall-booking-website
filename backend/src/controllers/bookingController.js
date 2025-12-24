const db = require('../config/db');
const { sendEmail } = require('../utils/emailService');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class BookingController {
    // Create new booking
    async createBooking(req, res) {
        try {
            const customerId = req.user.id;
            const {
                hall_id,
                event_date,
                event_type,
                guests_count,
                special_requests,
                payment_method,
                advance_amount
            } = req.body;

            // Check hall availability
            const [existingBooking] = await db.query(`
                SELECT * FROM bookings 
                WHERE hall_id = ? 
                AND event_date = ? 
                AND booking_status IN ('confirmed', 'pending')
            `, [hall_id, event_date]);

            if (existingBooking.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Hall is already booked for this date'
                });
            }

            // Get hall details
            const [hall] = await db.query(
                'SELECT * FROM halls WHERE hall_id = ?',
                [hall_id]
            );

            if (!hall) {
                return res.status(404).json({
                    success: false,
                    message: 'Hall not found'
                });
            }

            const totalAmount = hall.price_per_day;
            const bookingStatus = payment_method === 'cash' ? 'pending' : 'pending_payment';

            // Generate booking reference
            const bookingRef = 'BK' + Date.now() + Math.floor(Math.random() * 1000);

            // Create booking
            const [bookingResult] = await db.query(`
                INSERT INTO bookings (
                    booking_reference, hall_id, customer_id, event_date, 
                    event_type, guests_count, total_amount, advance_amount,
                    payment_method, booking_status, special_requests
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [bookingRef, hall_id, customerId, event_date, event_type, 
                guests_count, totalAmount, advance_amount, payment_method, 
                bookingStatus, special_requests]);

            const bookingId = bookingResult.insertId;

            // Get agent details for notification
            const [agent] = await db.query(`
                SELECT u.email, u.name, u.phone 
                FROM users u
                JOIN halls h ON u.user_id = h.agent_id
                WHERE h.hall_id = ?
            `, [hall_id]);

            // Send notifications
            await this.sendBookingNotifications({
                bookingId,
                customerId,
                agent: agent[0],
                hall: hall[0],
                event_date,
                event_type
            });

            // Create Razorpay order if online payment
            let paymentOrder = null;
            if (payment_method === 'online') {
                const options = {
                    amount: advance_amount * 100, // in paise
                    currency: 'INR',
                    receipt: bookingRef,
                    notes: {
                        booking_id: bookingId.toString(),
                        hall_id: hall_id.toString()
                    }
                };

                paymentOrder = await razorpay.orders.create(options);

                // Save payment order
                await db.query(`
                    INSERT INTO payments (
                        booking_id, order_id, amount, payment_method, 
                        payment_status, currency
                    ) VALUES (?, ?, ?, 'online', 'pending', 'INR')
                `, [bookingId, paymentOrder.id, advance_amount]);
            }

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: {
                    booking_id: bookingId,
                    booking_reference: bookingRef,
                    payment_order: paymentOrder
                }
            });

        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating booking'
            });
        }
    }

    // Get user bookings
    async getUserBookings(req, res) {
        try {
            const userId = req.user.id;
            const { status, page = 1, limit = 10 } = req.query;

            let query = `
                SELECT b.*, 
                    h.hall_name,
                    h.location,
                    h.city,
                    (SELECT image_url FROM hall_images WHERE hall_id = h.hall_id AND is_primary = 1 LIMIT 1) as hall_image,
                    p.payment_status as latest_payment_status
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                LEFT JOIN payments p ON b.booking_id = p.booking_id
                WHERE b.customer_id = ?
            `;

            const params = [userId];

            if (status) {
                query += ' AND b.booking_status = ?';
                params.push(status);
            }

            query += ' ORDER BY b.booking_date DESC LIMIT ? OFFSET ?';
            params.push(parseInt(limit), (page - 1) * limit);

            const bookings = await db.query(query, params);

            // Get total count
            const [countResult] = await db.query(
                'SELECT COUNT(*) as total FROM bookings WHERE customer_id = ?',
                [userId]
            );

            res.json({
                success: true,
                data: bookings,
                pagination: {
                    total: countResult.total,
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching bookings'
            });
        }
    }

    // Cancel booking
    async cancelBooking(req, res) {
        try {
            const { booking_id } = req.params;
            const { reason } = req.body;
            const userId = req.user.id;

            // Check if booking exists and belongs to user
            const [booking] = await db.query(`
                SELECT * FROM bookings 
                WHERE booking_id = ? AND customer_id = ?
            `, [booking_id, userId]);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            // Check if cancellation is allowed (at least 2 days before event)
            const eventDate = new Date(booking.event_date);
            const today = new Date();
            const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Cancellation not allowed within 48 hours of event'
                });
            }

            // Update booking status
            await db.query(`
                UPDATE bookings 
                SET booking_status = 'cancelled', 
                    cancellation_reason = ?,
                    cancelled_at = NOW()
                WHERE booking_id = ?
            `, [reason, booking_id]);

            // Refund payment if online
            if (booking.payment_method === 'online' && booking.advance_amount > 0) {
                // Process refund through Razorpay
                // Implementation depends on your payment gateway
            }

            // Send cancellation notifications
            await this.sendCancellationNotification(booking_id);

            res.json({
                success: true,
                message: 'Booking cancelled successfully'
            });

        } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Error cancelling booking'
            });
        }
    }

    // Send booking notifications
    async sendBookingNotifications(data) {
        try {
            // Get customer details
            const [customer] = await db.query(
                'SELECT email, name, phone FROM users WHERE user_id = ?',
                [data.customerId]
            );

            // Email to customer
            await sendEmail({
                to: customer.email,
                subject: 'Booking Confirmation - Function Hall Booking',
                template: 'booking-confirmation',
                context: {
                    customer_name: customer.name,
                    hall_name: data.hall.hall_name,
                    booking_date: data.event_date,
                    event_type: data.event_type,
                    booking_reference: data.bookingId
                }
            });

            // Email to agent
            await sendEmail({
                to: data.agent.email,
                subject: 'New Booking Received',
                template: 'new-booking-agent',
                context: {
                    agent_name: data.agent.name,
                    hall_name: data.hall.hall_name,
                    customer_name: customer.name,
                    booking_date: data.event_date,
                    event_type: data.event_type,
                    customer_phone: customer.phone
                }
            });

            // Send SMS (optional - integrate with SMS gateway)
            // await sendSMS(...);

        } catch (error) {
            console.error('Send notification error:', error);
        }
    }

    async sendCancellationNotification(bookingId) {
        // Similar implementation for cancellation notifications
    }
}

module.exports = new BookingController();