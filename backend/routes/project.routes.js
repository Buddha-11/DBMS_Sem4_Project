const express = require('express');
const router = express.Router();
const {createProject, getUserProjects ,getProjectById,updateProject,deleteProject} = require("../controllers/project.controllers")

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
router.get('/projects/:project_id', async (req, res) => {
    try {
      const project = await getProjectById(req.params.project_id);
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
router.delete('/projects/:project_id', async (req, res) => {
    try {
      const deleted = await deleteProject(req.params.project_id);
      if (deleted) {
        res.json({ message: 'Project deleted successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
router.put('/projects/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const { name, description } = req.body;
  
    try {
      const updated = await updateProject(project_id, name, description);
      if (updated) {
        res.json({ message: 'Project updated successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;