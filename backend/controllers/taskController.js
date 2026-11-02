const { pool } = require('../config/db');

// @desc    Get all tasks with optional search & filter
// @route   GET /api/tasks
const getAllTasks = async (req, res, next) => {
  try {
    const { search, status, priority } = req.query;

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword);
    }

    if (status && status.trim() !== '') {
      query += ' AND status = ?';
      params.push(status.trim());
    }

    if (priority && priority.trim() !== '') {
      query += ' AND priority = ?';
      params.push(priority.trim());
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status = 'Pending', priority = 'Medium' } = req.body;

    const query = `
      INSERT INTO tasks (title, description, status, priority)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      title.trim(),
      description ? description.trim() : null,
      status,
      priority
    ]);

    const [inserted] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: inserted[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // Check if task exists
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found.`
      });
    }

    const current = existing[0];
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedDesc = description !== undefined ? (description ? description.trim() : null) : current.description;
    const updatedStatus = status !== undefined ? status : current.status;
    const updatedPriority = priority !== undefined ? priority : current.priority;

    const query = `
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await pool.query(query, [updatedTitle, updatedDesc, updatedStatus, updatedPriority, id]);

    const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found.`
      });
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Task ${id} deleted successfully.`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Health check endpoint
// @route   GET /api/health
const getHealth = async (req, res) => {
  try {
    await pool.query('SELECT 1 AS health');
    res.status(200).json({
      status: 'UP',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getHealth
};
