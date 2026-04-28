const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  deleteCompleted,
  getStats
} = require('../controllers/taskController');

// All routes are protected
router.get('/stats', protect, getStats);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/completed', protect, deleteCompleted);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/toggle', protect, toggleTask);

module.exports = router;