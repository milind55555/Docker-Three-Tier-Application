import React from 'react';
import { CheckCircle2, Clock, PlayCircle, ListTodo } from 'lucide-react';

const DashboardStats = ({ tasks = [] }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <section className="stats-grid" aria-label="Task Statistics">
      <div className="stat-card total" id="stat-card-total">
        <div className="stat-icon-wrapper">
          <ListTodo size={24} />
        </div>
        <div className="stat-info">
          <h4>Total Tasks</h4>
          <span className="stat-number">{total}</span>
        </div>
      </div>

      <div className="stat-card pending" id="stat-card-pending">
        <div className="stat-icon-wrapper">
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <h4>Pending</h4>
          <span className="stat-number">{pending}</span>
        </div>
      </div>

      <div className="stat-card progress" id="stat-card-progress">
        <div className="stat-icon-wrapper">
          <PlayCircle size={24} />
        </div>
        <div className="stat-info">
          <h4>In Progress</h4>
          <span className="stat-number">{inProgress}</span>
        </div>
      </div>

      <div className="stat-card completed" id="stat-card-completed">
        <div className="stat-icon-wrapper">
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <h4>Completed</h4>
          <span className="stat-number">{completed}</span>
        </div>
      </div>
    </section>
  );
};

export default DashboardStats;
