const db = require('../config/db');

class AgentController {
    // Get agent dashboard stats
    async getDashboardStats(req, res) {
        try {
            const agentId = req.user.id;

            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_halls,
                    SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved_halls,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_halls
                FROM halls 
                WHERE agent_id = ?
            `, [agentId]);

            const [bookingStats] = await db.query(`
                SELECT 
                    COUNT(*) as total_bookings,
                    SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                    SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
                    SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
                    SUM(CASE WHEN booking_status = 'completed' THEN 1 ELSE 0 END) as completed_bookings
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                WHERE h.agent_id = ?
            `, [agentId]);

            const [revenueStats] = await db.query(`
                SELECT 
                    SUM(total_amount) as total_revenue,
                    SUM(advance_amount) as advance_collected,
                    MONTH(booking_date) as month,
                    YEAR(booking_date) as year
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                WHERE h.agent_id = ? 
                AND booking_status = 'confirmed'
                AND booking_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY YEAR(booking_date), MONTH(booking_date)
                ORDER BY year DESC, month DESC
            `, [agentId]);

            const [recentBookings] = await db.query(`
                SELECT b.*, 
                    h.hall_name,
                    u.name as customer_name,
                    u.phone as customer_phone
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                JOIN users u ON b.customer_id = u.user_id
                WHERE h.agent_id = ?
                ORDER BY b.booking_date DESC
                LIMIT 10
            `, [agentId]);

            res.json({
                success: true,
                data: {
                    hall_stats: stats,
                    booking_stats: bookingStats,
                    revenue_stats: revenueStats,
                    recent_bookings: recentBookings
                }
            });

        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard stats'
            });
        }
    }

    // Get agent's halls
    async getAgentHalls(req, res) {
        try {
            const agentId = req.user.id;
            const { status } = req.query;

            let query = `
                SELECT h.*,
                    (SELECT COUNT(*) FROM bookings WHERE hall_id = h.hall_id) as total_bookings,
                    (SELECT AVG(rating) FROM reviews r JOIN bookings b ON r.booking_id = b.booking_id WHERE b.hall_id = h.hall_id) as avg_rating
                FROM halls h
                WHERE h.agent_id = ?
            `;

            const params = [agentId];

            if (status === 'active') {
                query += ' AND h.is_active = 1';
            } else if (status === 'inactive') {
                query += ' AND h.is_active = 0';
            } else if (status === 'pending') {
                query += ' AND h.is_approved = 0';
            }

            query += ' ORDER BY h.created_at DESC';

            const halls = await db.query(query, params);

            res.json({
                success: true,
                data: halls
            });

        } catch (error) {
            console.error('Get agent halls error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching halls'
            });
        }
    }

    // Update hall status
    async updateHallStatus(req, res) {
        try {
            const { hall_id } = req.params;
            const { is_active, is_approved } = req.body;
            const agentId = req.user.id;

            // Verify ownership
            const [hall] = await db.query(
                'SELECT * FROM halls WHERE hall_id = ? AND agent_id = ?',
                [hall_id, agentId]
            );

            if (!hall) {
                return res.status(404).json({
                    success: false,
                    message: 'Hall not found or unauthorized'
                });
            }

            const updates = [];
            const params = [];

            if (is_active !== undefined) {
                updates.push('is_active = ?');
                params.push(is_active);
            }

            if (is_approved !== undefined) {
                updates.push('is_approved = ?');
                params.push(is_approved);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No updates provided'
                });
            }

            params.push(hall_id);

            await db.query(
                `UPDATE halls SET ${updates.join(', ')} WHERE hall_id = ?`,
                params
            );

            res.json({
                success: true,
                message: 'Hall status updated successfully'
            });

        } catch (error) {
            console.error('Update hall status error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating hall status'
            });
        }
    }

    // Get booking calendar
    async getBookingCalendar(req, res) {
        try {
            const agentId = req.user.id;
            const { month, year } = req.query;

            const bookings = await db.query(`
                SELECT 
                    b.event_date,
                    b.booking_status,
                    b.event_type,
                    h.hall_name,
                    u.name as customer_name
                FROM bookings b
                JOIN halls h ON b.hall_id = h.hall_id
                JOIN users u ON b.customer_id = u.user_id
                WHERE h.agent_id = ?
                AND MONTH(b.event_date) = ?
                AND YEAR(b.event_date) = ?
                ORDER BY b.event_date
            `, [agentId, month, year]);

            res.json({
                success: true,
                data: bookings
            });

        } catch (error) {
            console.error('Get booking calendar error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching calendar'
            });
        }
    }
}

module.exports = new AgentController();