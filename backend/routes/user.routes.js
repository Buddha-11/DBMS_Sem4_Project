const express = require('express');
const {createUser ,getAllUsers ,getUserById,updateUser,signInUser} = require("../controllers/user.controllers");
const { verifyToken } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/users', async (req, res) => {
  console.log(req.body);
  
  const { name, email, password, phone } = req.body;
  try {
    const id = await createUser(name, email, password, phone);
    res.status(201).json({ user_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users',verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    console.log(user);
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users', async (req, res) => {
  const updateData = req.body;

  try {
    const updated = await updateUser(req.user.id, updateData);
    if (updated) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
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