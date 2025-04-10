const express = require('express');
const router = express.Router();
const {addChecklistItem, setReminder,addComment} = require("../controllers/features.controllers")
// ---------- CHECKLIST ----------
router.post('/checklist', async (req, res) => {
    const { task_id, title, completed } = req.body;
    try {
      const id = await addChecklistItem(task_id, title, completed);
      res.status(201).json({ checklist_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // ---------- REMINDERS ----------
  router.post('/reminders', async (req, res) => {
    const { task_id, reminder_time, method } = req.body;
    try {
      const id = await setReminder(task_id, reminder_time, method);
      res.status(201).json({ reminder_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // ---------- COMMENTS ----------
  router.post('/comments', async (req, res) => {
    const { task_id, user_id, content } = req.body;
    try {
      const id = await addComment(task_id, user_id, content);
      res.status(201).json({ comment_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;