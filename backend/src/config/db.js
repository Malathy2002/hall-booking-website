const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'function_hall_booking',
            port: Number(process.env.DB_PORT) || 3306,

            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,

            enableKeepAlive: true,
            keepAliveInitialDelay: 10000
        });
    }

    // Use query() instead of execute() for flexibility
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Database query error:', error.message);
            throw error;
        }
    }

    async transaction(operations) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await operations(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async checkConnection() {
        let connection;
        try {
            connection = await this.pool.getConnection();
            console.log('✅ Database connected successfully');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new Database();
