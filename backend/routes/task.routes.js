const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const pool = require('../config/db');
const {
  createTask,
  getProjectTasks,
  addSubtask,
  updateTask,
  addChecklistItem,
  getChecklistItems,
  deleteSubtask,
  deleteTask,
  getUserTasks,
  getSubtasks,
  updateTaskStatus,
} = require("../controllers/task.controllers");
const {verifyToken }= require('../middlewares/auth.middleware')
router.use(verifyToken);

// Create a task
router.post('/tasks', async (req, res) => {
  console.log('create task hit');

  const { title, description, due_date, priority, status, project_id } = req.body;

  try {
    const created_by = req.user.id; // Assuming the user ID is stored in req.user
    console.log(
      created_by,
      title,
      description,
      due_date,
      priority,
      status,
      project_id
    );

    const result = await createTask(title, description, due_date, priority, status, created_by, project_id);

    if (result.warning) {
      // ⚠️ Conflict! Send HTTP 409 with warning and conflicting tasks
      return res.status(409).json({
        warning: result.warning,
        conflictingTasks: result.conflictingTasks,
      });
    }

    // ✅ Success — send 201 with task ID
    return res.status(201).json({
      task_id: result.task_id,
      message: result.message,
    });

  } catch (err) {
    console.error("❌ Server error while creating task:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});


// Get all tasks for a project
router.get('/tasks/:project_id', async (req, res) => {
  try {
    const tasks = await getProjectTasks(req.params.project_id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Update a task
router.patch('/tasks/:task_id', async (req, res) => {
  const { task_id } = req.params;
  const updates = req.body;
  try {
    console.log(task_id, updates);
    
    await updateTask(task_id, updates);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update task status
router.patch('/tasks/status/:task_id', async (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;
  try {
    await updateTaskStatus(task_id, status);
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a task (with cascade)
router.delete('/tasks/:task_id', async (req, res) => {
  try {
    console.log(req.params.task_id);
    
    await deleteTask(req.params.task_id);
    res.status(200).json({ message: "Task and related data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Subtasks here
// Add a subtask
router.post('/subtasks/:task_id', async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const task_id = req.params.task_id;
    console.log(task_id, title, description, due_date);
    
    const id = await addSubtask(task_id, title, description, due_date);
    console.log(id);
    
    res.status(201).json({ subtask_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/subtasks/:task_id', async (req, res) => {
  console.log("get subtasks hit");
  
  try {
    const subtasks = await getSubtasks(req.params.task_id);
    res.status(200).json(subtasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a subtask
router.delete('/subtasks/:subtask_id', async (req, res) => {
  try {
    await deleteSubtask(req.params.subtask_id);
    res.status(200).json({ message: "Subtask deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Add a checklist item
router.post('/checklist/:task_id', async (req, res) => {
  const { title, completed = false } = req.body;
  try {
    const task_id = req.params.task_id;
    const id = await addChecklistItem(task_id, title, completed);
    res.status(201).json({ checklist_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all checklist items for a task
router.get('/checklist/:task_id', async (req, res) => {
  try {
    const items = await getChecklistItems(req.params.task_id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// IST offset in milliseconds (UTC +5:30 = 19800000 ms)
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

// Schedule a job to run every 1 minute
cron.schedule('* * * * *', async () => {
  try {
    const istNow = new Date(Date.now() + IST_OFFSET)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

    console.log(`[CRON] Checking for missed tasks at IST time: ${istNow}`);

    const [result] = await pool.query(
      `
        UPDATE tasks 
        SET status = 'Missed'
        WHERE status != 'Completed' 
          AND due_date < ?
          AND (status != 'Missed' OR status IS NULL)
      `,
      [istNow]
    );

    if (result.affectedRows > 0) {
      console.log(`[CRON] ✅ Marked ${result.affectedRows} tasks as Missed`);
    } else {
      console.log(`[CRON] No overdue tasks found at this run`);
    }
  } catch (err) {
    console.error('[CRON] ❌ Error updating missed tasks:', err.message);
  }
});

module.exports = router;
