require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Create MySQL connection pool using the URI
const pool = mysql.createPool(process.env.DATABASE_URL + "?ssl=true").promise();

// Middleware
app.use(express.json());
app.use(cors());

// Test DB Connection
pool.getConnection()
    .then(conn => {
        console.log("Connected to Aiven MySQL");
        conn.release();
    })
    .catch(err => console.error("Database connection error:", err));

// Sample Route to Fetch Data
app.get('/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
