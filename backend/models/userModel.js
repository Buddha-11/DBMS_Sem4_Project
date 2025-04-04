const pool = require('../config/db');

// Create a new user
const createUser = async (name, email, password_hash, phone) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
            [name, email, password_hash, phone]
        );
        return result.insertId; // Return new user ID
    } catch (error) {
        throw error;
    }
};

// Get all users
const getUsers = async () => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users`);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Get a user by ID
const getUserById = async (userId) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);
        return rows[0]; // Return first user found
    } catch (error) {
        throw error;
    }
};

// Delete a user
const deleteUser = async (userId) => {
    try {
        const [result] = await pool.query(`DELETE FROM users WHERE user_id = ?`, [userId]);
        return result.affectedRows; // Returns number of deleted rows
    } catch (error) {
        throw error;
    }
};

module.exports = { createUser, getUsers, getUserById, deleteUser };
