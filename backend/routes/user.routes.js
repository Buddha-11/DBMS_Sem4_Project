const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, signInUser } = require("../controllers/user.controllers");
const { verifyToken } = require('../middlewares/auth.middleware');
const { sendOTPEmail } = require("../Utils/sendOTP"); // REMOVE `.js` if you're using CommonJS

const router = express.Router();

// Store OTPs globally
global.otpStore = global.otpStore || {};

router.post("/users/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  global.otpStore[email] = otp;

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Signup with OTP verification
router.post('/users', async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  const expectedOTP = global.otpStore[email];
  if (!expectedOTP || expectedOTP !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  try {
    const id = await createUser(name, email, password, phone);
    delete global.otpStore[email];
    res.status(201).json({ user_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users', async (req, res) => {
  try {
    const updated = await updateUser(req.user.id, req.body);
    updated
      ? res.json({ message: 'User updated successfully' })
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await signInUser(email, password);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
