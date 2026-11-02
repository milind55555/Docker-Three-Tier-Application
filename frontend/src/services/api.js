import axios from 'axios';

// Base API configuration with environment variable support
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for uniform error formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMsg = 'An unexpected network error occurred.';
    if (error.response) {
      // Backend returned error status
      errorMsg = error.response.data?.message || error.response.data?.errors?.join(', ') || errorMsg;
    } else if (error.request) {
      errorMsg = 'Cannot reach backend server. Please verify the service is running.';
    } else {
      errorMsg = error.message;
    }
    return Promise.reject(new Error(errorMsg));
  }
);

export const taskService = {
  // Health check
  checkHealth: async () => {
    return apiClient.get('/health');
  },

  // Fetch tasks with optional filters
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    return apiClient.get(`/tasks?${params.toString()}`);
  },

  // Fetch single task
  getTaskById: async (id) => {
    return apiClient.get(`/tasks/${id}`);
  },

  // Create new task
  createTask: async (taskData) => {
    return apiClient.post('/tasks', taskData);
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    return apiClient.put(`/tasks/${id}`, taskData);
  },

  // Delete task
  deleteTask: async (id) => {
    return apiClient.delete(`/tasks/${id}`);
  },
};

export default apiClient;
