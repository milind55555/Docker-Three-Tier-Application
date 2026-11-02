import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, task, isDeleting }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--priority-high)' }}>
            <AlertTriangle size={20} />
            <h3 style={{ color: 'var(--text-main)' }}>Confirm Deletion</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: 'var(--text-main)' }}>"{task.title}"</strong>?
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
            This action cannot be undone and will delete the record from MySQL.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            {isDeleting ? <div className="spinner" /> : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
