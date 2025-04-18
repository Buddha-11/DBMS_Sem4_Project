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

const getProjectById = async (project_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM projects WHERE project_id = ?`,
    [project_id]
  );
  return rows[0];
};

const updateProject = async (project_id, name, description) => {
  const [result] = await pool.query(
    `UPDATE projects SET name = ?, description = ? WHERE project_id = ?`,
    [name, description, project_id]
  );
  return result.affectedRows > 0;
};

const deleteProject = async (project_id) => {
  await pool.query(`DELETE FROM tasks WHERE project_id = ?`, [project_id]);
  const [result] = await pool.query(
    `DELETE FROM projects WHERE project_id = ?`,
    [project_id]
  );
  return result.affectedRows > 0;
};

  module.exports = {createProject,getUserProjects,getProjectById,updateProject,deleteProject};