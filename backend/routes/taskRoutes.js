const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getHealth
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask
} = require('../middleware/validateTask');

// Health check endpoint
router.get('/health', getHealth);

// Task CRUD endpoints
router.route('/tasks')
  .get(getAllTasks)
  .post(validateCreateTask, createTask);

router.route('/tasks/:id')
  .get(getTaskById)
  .put(validateUpdateTask, updateTask)
  .delete(deleteTask);

module.exports = router;
