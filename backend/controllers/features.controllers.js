const pool = require ("../config/db")

// ---------- CHECKLIST ----------
const addChecklistItem = async (task_id, title, completed = false) => {
    const [result] = await pool.query(
      `INSERT INTO checklist (task_id, title, completed) VALUES (?, ?, ?)`,
      [task_id, title, completed]
    );
    return result.insertId;
  };
  
  // ---------- REMINDERS ----------
  const setReminder = async (task_id, reminder_time, method) => {
    const [result] = await pool.query(
      `INSERT INTO reminder (task_id, reminder_time, method) VALUES (?, ?, ?)`,
      [task_id, reminder_time, method]
    );
    return result.insertId;
  };
  
  // ---------- COMMENTS ----------
  const addComment = async (task_id, user_id, content) => {
    const [result] = await pool.query(
      `INSERT INTO comment (task_id, user_id, content) VALUES (?, ?, ?)`,
      [task_id, user_id, content]
    );
    return result.insertId;
  };
  
  module.exports ={addChecklistItem,addComment,setReminder};