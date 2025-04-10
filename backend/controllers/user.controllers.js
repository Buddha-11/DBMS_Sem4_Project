const pool = require('../config/db'); 

const createUser = async (name, email, password_hash, phone) => {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
      [name, email, password_hash, phone]
    );
    return result.insertId;
  };
  
  const getUserByEmail = async (email) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
  };

  module.exports = { createUser, getUserByEmail };