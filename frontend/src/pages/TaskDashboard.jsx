import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import { Search, Filter, AlertCircle, RefreshCw, PlusCircle, Inbox } from 'lucide-react';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Health probe
  const checkSystemHealth = async () => {
    try {
      const res = await taskService.checkHealth();
      setIsConnected(res.status === 'UP' && res.database === 'connected');
    } catch {
      setIsConnected(false);
    }
  };

  // Load tasks from backend
  const loadTasks = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await taskService.getTasks({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
      });
      setTasks(res.data || []);
      setError(null);
      checkSystemHealth();
    } catch (err) {
      setError(err.message || 'Failed to load tasks from server.');
      setIsConnected(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Periodic health check
  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Operations
  const handleCreateOrUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask.id, formData);
        addToast(`Task "${formData.title}" updated successfully!`, 'success');
      } else {
        await taskService.createTask(formData);
        addToast(`Task "${formData.title}" created successfully!`, 'success');
      }
      setIsFormModalOpen(false);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      addToast(err.message || 'Action failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      addToast(`Status changed to ${newStatus}`, 'success');
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      addToast(err.message || 'Could not update status.', 'error');
      loadTasks();
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(taskToDelete.id);
      addToast(`Task "${taskToDelete.title}" deleted.`, 'success');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      loadTasks();
    } catch (err) {
      addToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar
        onOpenCreateModal={() => {
          setSelectedTask(null);
          setIsFormModalOpen(true);
        }}
        isConnected={isConnected}
        onRefresh={() => loadTasks(true)}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        {/* Statistics Bar */}
        <DashboardStats tasks={tasks} />

        {/* Global Connection Warning */}
        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              color: '#fda4af',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} color="var(--priority-high)" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadTasks(true)}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Controls: Search & Filters */}
        <div className="controls-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              id="search-tasks-input"
              type="text"
              className="search-input"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-wrapper">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              <Filter size={16} />
              <span>Filter:</span>
            </div>

            <select
              id="status-filter-select"
              className="custom-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              id="priority-filter-select"
              className="custom-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Task Grid / Loading / Empty States */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0', gap: '1rem' }}>
            <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading tasks from database...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-state-icon" />
            <h3>No Tasks Found</h3>
            <p>
              {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
                ? 'Try adjusting your search keywords or filter criteria.'
                : 'Get started by creating your first task in the management system.'}
            </p>
            <button
              className="btn-primary"
              style={{ margin: '0 auto' }}
              onClick={() => {
                setSelectedTask(null);
                setIsFormModalOpen(true);
              }}
            >
              <PlusCircle size={18} /> Create New Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setIsFormModalOpen(true);
                }}
                onDelete={(t) => {
                  setTaskToDelete(t);
                  setIsDeleteModalOpen(true);
                }}
                onStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Toasts */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialTask={selectedTask}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
        task={taskToDelete}
        isDeleting={isDeleting}
      />

      <Toast toasts={toasts} />
    </div>
  );
};

export default TaskDashboard;
