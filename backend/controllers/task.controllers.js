const pool = require('../config/db');
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
};
// ---------- CREATE TASK ----------
const createTask = async (title, description, due_date, priority, status, created_by, project_id) => {
  
  console.log('Creating task with:', {
    title,
    description,
    due_date,
    priority,
    status,
    created_by,
    project_id
  });
  const [result] = await pool.query(
    `INSERT INTO tasks (title, description, due_date, priority, status, created_by, project_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, due_date, priority, status, created_by, project_id]
  );
  console.log(result);
  if (result.affectedRows === 0) {
    throw new Error('Failed to create task');
  }
  
  return result.insertId;
};

// ---------- GET PROJECT TASKS ----------
const getProjectTasks = async (project_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM tasks WHERE project_id = ?`,
    [project_id]
  );
  return rows;
};
const getUserTasks = async (created_by) => {
  const [rows] = await pool.query(
    `SELECT * FROM tasks WHERE created_by = ?`,
    [created_by]
  );
  return rows;
};


// ---------- UPDATE TASK ----------
function formatDateForMySQL(dateOrString) {
  const date = new Date(dateOrString);

  // Convert to local time by subtracting the timezone offset
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Format as "YYYY-MM-DD HH:mm:ss"
  return localDate.toISOString().slice(0, 19).replace('T', ' ');
}


const updateTask = async (task_id, updates) => {
  try {
    // Ensure due_date is correctly formatted
    if (updates.due_date) {
      const formatted = formatDateForMySQL(updates.due_date);
      console.log("Formatted due_date:", formatted);
      updates.due_date = formatted; // 🔥 Make sure this actually replaces it
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(task_id);

    console.log("Final updates:", updates);
    console.log("SQL Query:", `UPDATE tasks SET ${fields} WHERE task_id = ?`);
    console.log("SQL Values:", values);

    const [result] = await pool.query(
      `UPDATE tasks SET ${fields} WHERE task_id = ?`,
      values
    );

    console.log("Update result:", result);
    return result.affectedRows > 0;

  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};


// ---------- UPDATE TASK STATUS ----------
const updateTaskStatus = async (task_id, status) => {
  const [result] = await pool.query(
    `UPDATE tasks SET status = ? WHERE task_id = ?`,
    [status, task_id]
  );
  return result.affectedRows > 0;
};
// ---------- ADD SUBTASK ----------
const addSubtask = async (task_id, title, description, due_date) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  };
  due_date = formatDate(due_date);
  const [result] = await pool.query(
    `INSERT INTO subtasks (task_id, title, description, due_date)
     VALUES (?, ?, ?, ?)`,
    [task_id, title, description, due_date]
  );
  return result.insertId;
};
// ---------- GET SUBTASKS ----------
const getSubtasks = async (task_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM subtasks WHERE task_id = ?`,
    [task_id]
  );
  return rows;
};
// ---------- DELETE SUBTASK ----------
const deleteSubtask = async (subtask_id) => {
  const [result] = await pool.query(
    `DELETE FROM subtasks WHERE subtask_id = ?`,
    [subtask_id]
  );
  return result.affectedRows > 0;
};

// ---------- DELETE TASK (cascading deletes assumed in schema) ----------
const deleteTask = async (task_id) => {
  console.log("Deleting task with ID:", task_id);
  
  const [result] = await pool.query(
    `DELETE FROM tasks WHERE task_id = ?`,
    [task_id]
  );
  console.log("Delete result:", result);
  
  return result.affectedRows > 0;
};

// ---------- ADD CHECKLIST ITEM ----------
const addChecklistItem = async (task_id, title, completed = false) => {
  const [result] = await pool.query(
    `INSERT INTO checklist (task_id, title, completed) VALUES (?, ?, ?)`,
    [task_id, title, completed]
  );
  return result.insertId;
};

// ---------- GET CHECKLIST ITEMS ----------
const getChecklistItems = async (task_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM checklist WHERE task_id = ?`,
    [task_id]
  );
  return rows;
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  addSubtask,
  deleteSubtask,
  deleteTask,
  addChecklistItem,
  getChecklistItems,
  getUserTasks,
  getSubtasks,
  updateTaskStatus,
};
