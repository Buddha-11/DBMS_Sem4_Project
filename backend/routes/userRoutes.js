const express = require('express');
const { createUser, getUsers, getUserById, deleteUser } = require('../models/userModel');

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    console.log("hit");
    
    try {
        const { name, email, password_hash, phone } = req.body;
        const userId = await createUser(name, email, password_hash, phone);
        res.status(201).json({ message: "User created", user_id: userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await deleteUser(req.params.id);
        if (deleted === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
