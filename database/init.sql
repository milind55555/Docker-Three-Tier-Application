-- ==============================================================================
-- Task Management System - Database Initialization Script
-- MySQL 8 Compatible
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS task_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_management;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial sample tasks for verification
INSERT INTO tasks (title, description, status, priority) VALUES
('Set up production environment', 'Configure Docker, Docker Compose, and environment variables for deployment.', 'Completed', 'High'),
('Implement REST API endpoints', 'Develop CRUD operations with Express.js, mysql2 connection pooling, and input validation.', 'In Progress', 'High'),
('Build modern React frontend', 'Create responsive dashboard with Vite, stats summary, live filter, and task modal.', 'In Progress', 'Medium'),
('Database optimization & backup', 'Set up indexing and persistent Docker volume backup scripts for MySQL.', 'Pending', 'Low');
