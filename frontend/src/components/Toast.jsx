import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="var(--status-completed)" />
          ) : (
            <AlertCircle size={18} color="var(--priority-high)" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
