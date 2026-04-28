const Task = require('../models/Task');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    let query = { user: req.user._id };

    // Filter by status
    if (status === 'completed') query.isCompleted = true;
    if (status === 'pending') query.isCompleted = false;

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };

    const tasks = await Task.find(query).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle completion
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all completed tasks
const deleteCompleted = async (req, res) => {
  try {
    await Task.deleteMany({ user: req.user._id, isCompleted: true });
    res.json({ message: 'All completed tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task statistics
const getStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({ user: req.user._id, isCompleted: true });
    const pending = await Task.countDocuments({ user: req.user._id, isCompleted: false });
    const overdue = await Task.countDocuments({
      user: req.user._id,
      isCompleted: false,
      dueDate: { $lt: new Date() }
    });
    res.json({ total, completed, pending, overdue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, toggleTask, deleteCompleted, getStats };