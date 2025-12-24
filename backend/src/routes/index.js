const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const hallController = require('../controllers/hallController');
const bookingController = require('../controllers/bookingController');
const paymentController = require('../controllers/paymentController');
const reviewController = require('../controllers/reviewController');
const agentController = require('../controllers/agentController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/update-profile', protect, authController.updateProfile);

// Public hall routes
router.get('/halls', hallController.getAllHalls);
router.get('/halls/:id', hallController.getHallById);
router.get('/halls/:id/availability', hallController.checkAvailability);
router.get('/halls/cities', hallController.getCities);

// Protected hall routes (Agent only)
router.post('/halls', protect, authorize('agent'), hallController.createHall);
router.put('/halls/:id', protect, authorize('agent'), hallController.updateHall);
router.post('/halls/:id/images', protect, authorize('agent'), upload.array('images', 10), hallController.uploadHallImages);

// Booking routes
router.post('/bookings', protect, authorize('customer'), bookingController.createBooking);
router.get('/bookings', protect, bookingController.getUserBookings);
router.get('/bookings/:id', protect, bookingController.getBookingDetails);
router.put('/bookings/:id/cancel', protect, bookingController.cancelBooking);

// Payment routes
router.post('/payments/create-order', protect, paymentController.createPaymentOrder);
router.post('/payments/verify', protect, paymentController.verifyPayment);
router.get('/payments/history', protect, paymentController.getPaymentHistory);
router.post('/payments/cash', protect, paymentController.recordCashPayment);

// Review routes
router.post('/reviews', protect, authorize('customer'), reviewController.createReview);
router.get('/reviews/hall/:hall_id', reviewController.getHallReviews);
router.put('/reviews/:id', protect, reviewController.updateReview);

// Agent dashboard routes
router.get('/agent/dashboard', protect, authorize('agent'), agentController.getDashboardStats);
router.get('/agent/halls', protect, authorize('agent'), agentController.getAgentHalls);
router.get('/agent/bookings', protect, authorize('agent'), agentController.getAgentBookings);
router.get('/agent/calendar', protect, authorize('agent'), agentController.getBookingCalendar);
router.put('/agent/halls/:id/status', protect, authorize('agent'), agentController.updateHallStatus);

// Admin routes (if needed)
router.get('/admin/stats', protect, authorize('admin'), adminController.getStats);
router.get('/admin/pending-halls', protect, authorize('admin'), adminController.getPendingHalls);
router.put('/admin/approve-hall/:id', protect, authorize('admin'), adminController.approveHall);

module.exports = router;