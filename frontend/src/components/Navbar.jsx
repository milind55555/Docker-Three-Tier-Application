import React from 'react';
import { Layers, Plus, Activity, RefreshCw } from 'lucide-react';

const Navbar = ({ onOpenCreateModal, isConnected, onRefresh, isRefreshing }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="brand-title">TaskMaster Pro</h1>
            <p className="brand-subtitle">Three-Tier Architecture • React + Node + MySQL</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="status-badge-indicator" title={isConnected ? 'Backend & DB Connected' : 'Backend Disconnected'}>
            <span className={`pulse-dot ${isConnected ? 'online' : 'offline'}`} />
            <span>{isConnected ? 'System Healthy' : 'Connecting...'}</span>
          </div>

          <button
            id="refresh-tasks-btn"
            className="action-icon-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Task List"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spinner' : ''} />
          </button>

          <button
            id="create-task-btn"
            className="btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
