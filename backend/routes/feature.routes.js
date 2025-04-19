const express = require('express');
const router = express.Router();
const {addChecklistItem, setReminder,addComment,deleteChecklistItem,deleteComment,deleteReminder,updateChecklistItem} = require("../controllers/features.controllers")
// ---------- CHECKLIST ----------
router.post('/checklist', async (req, res) => {
    const { task_id, title, completed , description} = req.body;
    try {
      const id = await addChecklistItem(task_id, title, completed,description);
      res.status(201).json({ checklist_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.delete('/checklist/:checklist_id', async (req, res) => {
    try {
      const deleted = await deleteChecklistItem(req.params.checklist_id);
      if (deleted) {
        res.json({ message: 'Checklist item deleted successfully' });
      } else {
        res.status(404).json({ error: 'Checklist item not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.put('/checklist/:checklist_id', async (req, res) => {
    const { completed } = req.body;
    try {
      const updated = await updateChecklistItem(req.params.checklist_id, completed);
      if (updated) {
        res.json({ message: 'Checklist item updated successfully' });
      } else {
        res.status(404).json({ error: 'Checklist item not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  );
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

  router.delete('/reminders/:reminder_id', async (req, res) => {
    try {
      const deleted = await deleteReminder(req.params.reminder_id);
      if (deleted) {
        res.json({ message: 'Reminder deleted successfully' });
      } else {
        res.status(404).json({ error: 'Reminder not found' });
      }
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
  
  router.delete('/comments/:comment_id', async (req, res) => {
    try {
      const deleted = await deleteComment(req.params.comment_id);
      if (deleted) {
        res.json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  module.exports = router;
