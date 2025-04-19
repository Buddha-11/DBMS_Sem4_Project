require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const featureRoutes = require("./routes/feature.routes")
const taskRoutes = require("./routes/task.routes")
const projectRoutes = require("./routes/project.routes")
const collaborationRoutes = require("./routes/collaboration.routes")
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));    
app.get('/', (req, res) => {
    res.json("Hello");
});

// Routes
app.use('/api', userRoutes);
app.use('/api', featureRoutes);
app.use('/api', taskRoutes);
app.use('/api', projectRoutes);
app.use('/api', collaborationRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
