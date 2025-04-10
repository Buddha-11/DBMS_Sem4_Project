const express = require('express');
const {createUser , getUserByEmail} = require("../controllers/user.controllers")
const router = express.Router();

router.post('/users', async (req, res) => {
  const { name, email, password_hash, phone } = req.body;
  try {
    const id = await createUser(name, email, password_hash, phone);
    res.status(201).json({ user_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:email', async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    console.log(user);
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
