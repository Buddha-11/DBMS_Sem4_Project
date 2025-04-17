const express = require('express');
const router = express.Router();
const {createTask,getProjectTasks , addSubtask} = require("../controllers/task.controllers")
router.post('/tasks', async (req, res) => {
    const { title, description, due_date, priority, status, created_by, project_id } = req.body;
    try {
      const id = await createTask(title, description, due_date, priority, status, created_by, project_id);
      res.status(201).json({ task_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/tasks/:project_id', async (req, res) => {
    try {
      const tasks = await getProjectTasks(req.params.project_id);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/subtasks', async (req, res) => {
    const { task_id, title, description, due_date, status_id } = req.body;
    try {
      const id = await addSubtask(task_id, title, description, due_date, status_id);
      res.status(201).json({ subtask_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;