const pool = require ("../config/db")

const addCollaborator = async (task_id, user_id, role) => {
    const [result] = await pool.query(
      `INSERT INTO collaboration (task_id, user_id, role) VALUES (?, ?, ?)`,
      [task_id, user_id, role]
    );
    return result.insertId;
  };

  module.exports = {addCollaborator};