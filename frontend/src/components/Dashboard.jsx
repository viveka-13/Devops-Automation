import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

const emptySummary = {
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  totalTasks: 0,
  taskStatus: { todo: 0, inProgress: 0, done: 0 },
  recentActivity: []
};

export default function Dashboard({ token, user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'ACTIVE'
  });
  const [taskForm, setTaskForm] = useState({
    projectId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'TODO'
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadDashboard = async () => {
    try {
      const [dashboardResponse, projectsResponse, tasksResponse] = await Promise.all([
        apiRequest('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        apiRequest('/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        apiRequest('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(dashboardResponse.data || emptySummary);
      setProjects(projectsResponse.data || []);
      setTasks(tasksResponse.data || []);

      if (projectsResponse.data?.length) {
        setTaskForm((current) => ({ ...current, projectId: String(projectsResponse.data[0].id) }));
      }
    } catch (err) {
      setSummary(emptySummary);
      setProjects([]);
      setTasks([]);
      setError('Unable to load dashboard data.');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    if (!projectForm.name.trim()) {
      setError('Project name is required.');
      setNotice('');
      return;
    }

    try {
      await apiRequest('/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      setProjectForm({ name: '', description: '', dueDate: '', status: 'ACTIVE' });
      setError('');
      setNotice('Project created successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Project could not be created.');
      setNotice('');
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    if (!taskForm.projectId || !taskForm.title.trim()) {
      setError('Select a project and enter a task title.');
      setNotice('');
      return;
    }

    try {
      await apiRequest(`/api/projects/${taskForm.projectId}/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          status: taskForm.status,
          dueDate: taskForm.dueDate
        })
      });

      setTaskForm({
        projectId: taskForm.projectId,
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        status: 'TODO'
      });
      setError('');
      setNotice('Task created successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Task could not be created.');
      setNotice('');
    }
  };

  if (!summary) {
    return <div className="card">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="card welcome-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back, {user?.fullName || 'Team member'}</h2>
        </div>
        <button className="secondary-btn" onClick={onLogout}>Log out</button>
      </div>

      <div className="card stat-grid">
        <div className="stat-box"><span>Total projects</span><strong>{summary.totalProjects}</strong></div>
        <div className="stat-box"><span>Active projects</span><strong>{summary.activeProjects}</strong></div>
        <div className="stat-box"><span>Completed projects</span><strong>{summary.completedProjects}</strong></div>
        <div className="stat-box"><span>Total tasks</span><strong>{summary.totalTasks}</strong></div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Task status</h3>
          <ul className="activity-list">
            <li>To do: {summary.taskStatus.todo}</li>
            <li>In progress: {summary.taskStatus.inProgress}</li>
            <li>Done: {summary.taskStatus.done}</li>
          </ul>
        </div>

        <div className="card">
          <h3>Recent activity</h3>
          <ul className="activity-list">
            {(summary.recentActivity || []).length ? (
              (summary.recentActivity || []).map((entry) => (
                <li key={entry.id}>{entry.description}</li>
              ))
            ) : (
              <li>No recent activity yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="dashboard-grid">
        <form className="card form-card" onSubmit={handleProjectSubmit}>
          <h3>Create project</h3>
          <input
            value={projectForm.name}
            onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
            placeholder="Project name"
          />
          <textarea
            value={projectForm.description}
            onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
            placeholder="Project description"
            rows="3"
          />
          <div className="inline-fields">
            <input
              type="date"
              value={projectForm.dueDate}
              onChange={(event) => setProjectForm({ ...projectForm, dueDate: event.target.value })}
            />
            <select
              value={projectForm.status}
              onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })}
            >
              <option value="ACTIVE">Active</option>
              <option value="PLANNING">Planning</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <button type="submit" className="primary-btn">Add project</button>
        </form>

        <form className="card form-card" onSubmit={handleTaskSubmit}>
          <h3>Create task</h3>
          <select
            value={taskForm.projectId}
            onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <input
            value={taskForm.title}
            onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
            placeholder="Task title"
          />
          <textarea
            value={taskForm.description}
            onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            placeholder="Task description"
            rows="3"
          />
          <div className="inline-fields">
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
            />
            <select
              value={taskForm.priority}
              onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <select
            value={taskForm.status}
            onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
          <button type="submit" className="primary-btn">Add task</button>
        </form>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Projects</h3>
          <ul className="list-panel">
            {projects.length ? (
              projects.map((project) => (
                <li key={project.id}>
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                </li>
              ))
            ) : (
              <li>No projects available.</li>
            )}
          </ul>
        </div>

        <div className="card">
          <h3>Tasks</h3>
          <ul className="list-panel">
            {tasks.length ? (
              tasks.slice(0, 6).map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{task.status} · {task.priority}</span>
                </li>
              ))
            ) : (
              <li>No tasks available.</li>
            )}
          </ul>
        </div>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}
    </div>
  );
}
