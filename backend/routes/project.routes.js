const express = require('express');
const router = express.Router();
const {createProject, getUserProjects} = require("../controllers/project.controllers")
router.post('/projects', async (req, res) => {
    const { name, description, created_by } = req.body;
    try {
      const id = await createProject(name, description, created_by);
      res.status(201).json({ project_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.get('/projects/:user_id', async (req, res) => {
    try {
      const projects = await getUserProjects(req.params.user_id);
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;