const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(
  process.env.DATABASE_URL + "?ssl=true&multipleStatements=true"
).promise();

const initializeDB = async () => {
  try {
    await pool.query(`

      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


      CREATE TABLE IF NOT EXISTS projects (
        project_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      );

      CREATE TABLE IF NOT EXISTS tasks (
        task_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATETIME,
        priority ENUM('Low', 'Medium', 'High'),
        status ENUM('To-Do', 'InProgress', 'Completed','Missed'),
        created_by INT,
        project_id INT,
        FOREIGN KEY (created_by) REFERENCES users(user_id),
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      );


      CREATE TABLE IF NOT EXISTS subtasks (
        subtask_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        title VARCHAR(255),
        description TEXT,
        due_date DATETIME,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS checklist (
        checklist_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        title VARCHAR(255),
        completed BOOLEAN,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS reminder (
        reminder_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        reminder_time DATETIME,
        method ENUM('email', 'notification'),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS attachment (
        attachment_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        file_path TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS task_dependency (
        parent_task_id INT,
        child_task_id INT,
        dependency_type ENUM('FS', 'SS', 'FF', 'SF'),
        PRIMARY KEY (parent_task_id, child_task_id),
        FOREIGN KEY (parent_task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (child_task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS recurring_task (
        recurring_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        frequency ENUM('daily', 'weekly', 'monthly'),
        end_date DATETIME,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      CREATE TABLE IF NOT EXISTS collaboration (
        collaboration_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        user_id INT,
        role ENUM('editor', 'viewer'),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );

      CREATE TABLE IF NOT EXISTS comment (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        user_id INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );

      CREATE TABLE IF NOT EXISTS category (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      );

      CREATE TABLE IF NOT EXISTS task_category (
        task_id INT,
        category_id INT,
        PRIMARY KEY (task_id, category_id),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (category_id) REFERENCES category(category_id)
      );

      CREATE TABLE IF NOT EXISTS label (
        label_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        color VARCHAR(50),
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      );

      CREATE TABLE IF NOT EXISTS task_label (
        task_id INT,
        label_id INT,
        PRIMARY KEY (task_id, label_id),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (label_id) REFERENCES label(label_id)
      );
    `);

    console.log("✅ All tables created!");
  } catch (err) {
    console.error("❌ Initialization failed:", err);
  }
};

initializeDB();
module.exports = pool;
