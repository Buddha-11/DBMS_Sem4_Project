const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const {addChecklistItem, setReminder,addComment,deleteChecklistItem,deleteComment,deleteReminder,updateChecklistItem} = require("../controllers/features.controllers")
// ---------- CHECKLIST ----------

const pool = require('../config/db');

const nodemailer = require('nodemailer');
const { verifyToken } = require('../middlewares/auth.middleware');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
  router.post('/reminders', verifyToken, async (req, res) => {
    const { task_id, reminder_time, method } = req.body;
    
    try {
      // Save reminder to DB
      const [result] = await pool.query(
        `INSERT INTO reminder (task_id, reminder_time, method) VALUES (?, ?, ?)`,
        [task_id, reminder_time, method]
      );
      const reminder_id = result.insertId;
  
      // If method is email, schedule email
      if (method === 'email') {
        const [taskData] = await pool.query(`
          SELECT u.email, u.name, t.title, t.description, t.due_date
          FROM tasks t
          JOIN users u ON t.created_by = u.user_id
          WHERE t.task_id = ?
        `, [task_id]);
  
        if (taskData.length === 0) throw new Error('Task or user not found');
  
        const { email, name, title, description, due_date } = taskData[0];
  
        // Schedule the email reminder using cron
        const reminderDate = new Date(reminder_time);
        const cronExpression = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`; // Cron format
  
        cron.schedule(cronExpression, async () => {
          await transporter.sendMail({
            from: `"Task Reminder" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `⏰ Reminder for Task: ${title}`,
            text: `Hey ${name},\n\nJust a reminder for your task:\n\nTitle: ${title}\nDescription: ${description}\nDue: ${new Date(due_date).toLocaleString()}\n\n— Your Task Manager`,
          });
          console.log(`Reminder email sent to ${email}`);
        });
  
        console.log(`Scheduled reminder for ${reminder_time}`);
      }
  
      res.status(201).json({ reminder_id });
    } catch (err) {
      console.error('Reminder Error:', err);
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
