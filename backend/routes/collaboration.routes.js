const express = require('express');
const router = express.Router();
const {addCollaborator} = require("../controllers/collaboration.controllers")
router.post('/collaborators', async (req, res) => {
    const { task_id, user_id, role } = req.body;
    try {
      const id = await addCollaborator(task_id, user_id, role);
      res.status(201).json({ collaboration_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;