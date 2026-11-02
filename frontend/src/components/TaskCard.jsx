import React from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge status-pending';
      case 'In Progress':
        return 'badge status-in-progress';
      case 'Completed':
        return 'badge status-completed';
      default:
        return 'badge';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge priority-high';
      case 'Medium':
        return 'badge priority-medium';
      case 'Low':
        return 'badge priority-low';
      default:
        return 'badge';
    }
  };

  return (
    <article className="task-card" id={`task-card-${task.id}`}>
      <div>
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button
              className="action-icon-btn"
              onClick={() => onEdit(task)}
              title="Edit Task"
              id={`edit-task-btn-${task.id}`}
            >
              <Pencil size={14} />
            </button>
            <button
              className="action-icon-btn delete"
              onClick={() => onDelete(task)}
              title="Delete Task"
              id={`delete-task-btn-${task.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="task-badges">
          <span className={getStatusBadgeClass(task.status)}>
            {task.status}
          </span>
          <span className={getPriorityBadgeClass(task.priority)}>
            {task.priority} Priority
          </span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      <div className="task-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} />
          <span>{formatDate(task.created_at)}</span>
        </div>

        <div>
          <select
            className="card-status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            id={`status-select-${task.id}`}
            title="Quick change status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
