const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET

const createUser = async (name, email, password, phone) => {
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
    [name, email, password_hash, phone]
  );

  const token = jwt.sign({ user_id: result.insertId, email }, SECRET_KEY, { expiresIn: '1h' });
  console.log(token);
  
  return { user_id: result.insertId, token };
};

const signInUser = async (email, password) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  const user = rows[0];

  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '10h' });

  return { user, token };
};

const getUserById = async (user_id) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
  return rows[0];
};

const getAllUsers = async () => {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
};

const updateUser = async (user_id, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  values.push(user_id);

  const [result] = await pool.query(
    `UPDATE users SET ${setClause} WHERE user_id = ?`,
    values
  );

  return result.affectedRows > 0;
};

module.exports = { createUser,  getAllUsers , getUserById, signInUser, updateUser };