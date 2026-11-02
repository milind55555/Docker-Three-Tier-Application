const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const validateTaskPayload = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, description, status, priority } = req.body;
    const errors = [];

    // Title validation
    if (!isUpdate || title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required and must not be empty.');
      } else if (title.trim().length > 255) {
        errors.push('Title must be at most 255 characters long.');
      }
    }

    // Status validation
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
      }
    }

    // Priority validation
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
      }
    }

    // Description validation
    if (description !== undefined && description !== null && typeof description !== 'string') {
      errors.push('Description must be a string.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  validateCreateTask: validateTaskPayload(false),
  validateUpdateTask: validateTaskPayload(true),
  VALID_STATUSES,
  VALID_PRIORITIES
};
