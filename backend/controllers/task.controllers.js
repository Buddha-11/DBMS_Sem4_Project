const pool = require('../config/db');

const createTask = async (title, description, due_date, priority, status, created_by, project_id) => {
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, due_date, priority, status, created_by, project_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, due_date, priority, status, created_by, project_id]
    );
    return result.insertId;
  };
  
const getProjectTasks = async (project_id) => {
    const [rows] = await pool.query(
        `SELECT * FROM tasks WHERE project_id = ?`,
        [project_id]
    );
    return rows;
};

const addSubtask = async (task_id, title, description, due_date) => {
    const [result] = await pool.query(
      `INSERT INTO subtasks (task_id, title, description, due_date)
       VALUES (?, ?, ?, ?)`,
      [task_id, title, description, due_date]
    );
    return result.insertId;
  };
  module.exports ={createTask,getProjectTasks, addSubtask};