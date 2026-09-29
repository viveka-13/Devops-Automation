import { projects, tasks, comments, notifications, activityLogs } from '../data/store.js';

export const listProjects = (req, res) => {
  return res.status(200).json({
    success: true,
    data: projects,
    total: projects.length
  });
};

export const createProject = (req, res) => {
  const { name, description, dueDate, status = 'ACTIVE' } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Project name is required' });
  }

  const newProject = {
    id: projects.length ? projects[projects.length - 1].id + 1 : 1,
    name,
    description: description || '',
    ownerId: req.user.id,
    status,
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [req.user.id]
  };

  projects.unshift(newProject);

  activityLogs.unshift({
    id: activityLogs.length ? activityLogs[0].id + 1 : 1,
    userId: req.user.id,
    action: 'PROJECT_CREATED',
    entityType: 'project',
    entityId: newProject.id,
    description: `Project ${newProject.name} was created.`,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newProject });
};

export const getProjectById = (req, res) => {
  const project = projects.find((item) => item.id === Number(req.params.id));

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  return res.status(200).json({ success: true, data: project });
};

export const updateProject = (req, res) => {
  const project = projects.find((item) => item.id === Number(req.params.id));

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  Object.assign(project, {
    ...req.body,
    updatedAt: new Date().toISOString()
  });

  return res.status(200).json({ success: true, data: project });
};

export const archiveProject = (req, res) => {
  const project = projects.find((item) => item.id === Number(req.params.id));
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.status = 'ARCHIVED';
  project.updatedAt = new Date().toISOString();
  return res.status(200).json({ success: true, data: project });
};

export const getProjectTasks = (req, res) => {
  const projectTasks = tasks.filter((task) => task.projectId === Number(req.params.projectId));
  return res.status(200).json({ success: true, data: projectTasks, total: projectTasks.length });
};

export const createTask = (req, res) => {
  const { title, description, priority, assigneeId, dueDate, status = 'TODO' } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    projectId: Number(req.params.projectId),
    title,
    description: description || '',
    priority: priority || 'MEDIUM',
    status,
    assigneeId: assigneeId || null,
    creatorId: req.user.id,
    dueDate: dueDate || null,
    estimatedHours: 0,
    actualHours: 0,
    labels: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  notifications.unshift({
    id: notifications.length ? notifications[0].id + 1 : 1,
    userId: req.user.id,
    type: 'TASK_ASSIGNED',
    title: 'Task created',
    message: `Task ${newTask.title} created successfully.`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newTask });
};

export const dashboard = (req, res) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((project) => project.status === 'ACTIVE').length;
  const completedProjects = projects.filter((project) => project.status === 'COMPLETED').length;
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((task) => task.status === 'TODO').length;
  const inProgressCount = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((task) => task.status === 'DONE').length;

  return res.status(200).json({
    success: true,
    data: {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      taskStatus: {
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount
      },
      recentActivity: activityLogs.slice(0, 5)
    }
  });
};
