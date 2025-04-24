const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(
  process.env.DATABASE_URL + "?ssl=true&multipleStatements=true"
).promise();

const initializeDB = async () => {
  try {
    await pool.query(`
      
      -- SET GLOBAL event_scheduler = ON;
      -- CREATE EVENT mark_missed_tasks
      --   ON SCHEDULE EVERY 5 MINUTE
      --   DO
      --     UPDATE tasks
      --     SET status = 'Missed'
      --     WHERE status != 'Completed' AND due_date < NOW();

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
        FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
      );


      CREATE TABLE IF NOT EXISTS subtasks (
        subtask_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        title VARCHAR(255),
        description TEXT,
        due_date DATETIME,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS checklist (
        checklist_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        title VARCHAR(255),
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS archived_tasks (
        archive_id INT AUTO_INCREMENT PRIMARY KEY,
        original_task_id INT,
        title VARCHAR(255),
        description TEXT,
        due_date DATETIME,
        priority ENUM('Low', 'Medium', 'High'),
        status ENUM('To-Do', 'InProgress', 'Completed','Missed'),
        created_by INT,
        project_id INT,
        archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (original_task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id),
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      );
      
      DROP TRIGGER IF EXISTS archive_completed_task;

      CREATE TRIGGER archive_completed_task
      AFTER UPDATE ON tasks
      FOR EACH ROW
      BEGIN
        IF OLD.status <> 'Completed' AND NEW.status = 'Completed' THEN
          INSERT INTO archived_tasks (
            original_task_id,
            title,
            description,
            due_date,
            priority,
            status,
            created_by,
            project_id
          ) VALUES (
            NEW.task_id,
            NEW.title,
            NEW.description,
            NEW.due_date,
            NEW.priority,
            NEW.status,
            NEW.created_by,
            NEW.project_id
          );
        END IF;
      END;


      CREATE TABLE IF NOT EXISTS reminder (
        reminder_id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        reminder_time DATETIME,
        method ENUM('email', 'notification'),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );

      
    `);

    console.log("✅ All tables created!");
  } catch (err) {
    console.error("❌ Initialization failed:", err);
  }
};

initializeDB();
module.exports = pool;
