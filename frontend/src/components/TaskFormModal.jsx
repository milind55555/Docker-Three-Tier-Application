import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialTask = null, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'Pending');
      setPriority(initialTask.priority || 'Medium');
    } else {
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: 'var(--priority-high)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Task Title *
              </label>
              <input
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="e.g., Set up MySQL database container"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-status-select" className="form-label">
                  Status
                </label>
                <select
                  id="task-status-select"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority-select" className="form-label">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                Description
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Add context, acceptance criteria, or technical details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              id="submit-task-btn"
            >
              {isSubmitting ? (
                <div className="spinner" />
              ) : initialTask ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
