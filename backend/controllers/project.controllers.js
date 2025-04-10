const pool = require('../config/db');

const createProject = async (name, description, created_by) => {
    const [result] = await pool.query(
      `INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)`,
      [name, description, created_by]
    );
    return result.insertId;
  };
  
  const getUserProjects = async (user_id) => {
    const [rows] = await pool.query(
      `SELECT * FROM projects WHERE created_by = ?`,
      [user_id]
    );
    return rows;
  };

  module.exports = {createProject,getUserProjects};