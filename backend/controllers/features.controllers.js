const pool = require("../config/db");

// ---------- CHECKLIST ----------
const addChecklistItem = async (task_id, title, description,completed = false) => {
  const [result] = await pool.query(
    `INSERT INTO checklist (task_id, title, completed,decription) VALUES (?, ?, ?, ?)`,
    [task_id, title, completed, description]
  );
  return result.insertId;
};

const deleteChecklistItem = async (checklist_id) => {
  const [result] = await pool.query(
    `DELETE FROM checklist WHERE checklist_id = ?`,
    [checklist_id]
  );
  return result.affectedRows > 0;
};

const updateChecklistItem = async (checklist_id, completed) => {
  const [result] = await pool.query(
    `UPDATE checklist SET  completed = ? WHERE checklist_id = ?`,
    [ completed, checklist_id]
  );
  return result.affectedRows > 0;
};
// ---------- REMINDERS ----------
const setReminder = async (task_id, reminder_time, method) => {
  const [result] = await pool.query(
    `INSERT INTO reminder (task_id, reminder_time, method) VALUES (?, ?, ?)`,
    [task_id, reminder_time, method]
  );
  return result.insertId;
};

const deleteReminder = async (reminder_id) => {
  const [result] = await pool.query(
    `DELETE FROM reminder WHERE reminder_id = ?`,
    [reminder_id]
  );
  return result.affectedRows > 0;
};
const getUserReminders = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT 
       r.reminder_id, 
       r.task_id, 
       t.title AS task_title,
       t.priority,
       t.due_date,
       r.reminder_time, 
       r.method 
     FROM reminder r
     JOIN tasks t ON r.task_id = t.task_id
     WHERE t.created_by = ?`,
    [user_id]
  );

  console.log(rows); // Now includes task_title, priority, and due_date

  return rows;
};

// ---------- COMMENTS ----------
const addComment = async (task_id, user_id, content) => {
  const [result] = await pool.query(
    `INSERT INTO comment (task_id, user_id, content) VALUES (?, ?, ?)`,
    [task_id, user_id, content]
  );
  return result.insertId;
};

const deleteComment = async (comment_id) => {
  const [result] = await pool.query(
    `DELETE FROM comment WHERE comment_id = ?`,
    [comment_id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  addChecklistItem,
  deleteChecklistItem,
  addComment,
  deleteComment,
  setReminder,
  deleteReminder,
  updateChecklistItem,
  getUserReminders
};
