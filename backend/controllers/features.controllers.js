const pool = require("../config/db");

// ---------- CHECKLIST ----------
const addChecklistItem = async (task_id, title, completed = false) => {
  const [result] = await pool.query(
    `INSERT INTO checklist (task_id, title, completed) VALUES (?, ?, ?)`,
    [task_id, title, completed]
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
  deleteReminder
};
