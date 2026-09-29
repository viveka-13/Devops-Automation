import { tasks, comments, notifications, activityLogs } from '../data/store.js';

export const listTasks = (req, res) => {
  const { projectId, status, priority, assigneeId, q } = req.query;
  let filtered = [...tasks];

  if (projectId) {
    filtered = filtered.filter((task) => String(task.projectId) === String(projectId));
  }

  if (status) {
    filtered = filtered.filter((task) => task.status === status);
  }

  if (priority) {
    filtered = filtered.filter((task) => task.priority === priority);
  }

  if (assigneeId) {
    filtered = filtered.filter((task) => String(task.assigneeId) === String(assigneeId));
  }

  if (q) {
    const keyword = q.toLowerCase();
    filtered = filtered.filter((task) => task.title.toLowerCase().includes(keyword));
  }

  return res.status(200).json({
    success: true,
    data: filtered,
    total: filtered.length
  });
};

export const getTaskById = (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  return res.status(200).json({ success: true, data: task });
};

export const createTask = (req, res) => {
  const { title, description, priority, status = 'TODO', assigneeId, dueDate, labels = [] } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    projectId: Number(req.params.projectId),
    title,
    description: description || '',
    status,
    priority: priority || 'MEDIUM',
    assigneeId: assigneeId || null,
    creatorId: req.user.id,
    dueDate: dueDate || null,
    estimatedHours: 0,
    actualHours: 0,
    labels: Array.isArray(labels) ? labels : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  notifications.unshift({
    id: notifications.length ? notifications[0].id + 1 : 1,
    userId: req.user.id,
    type: 'TASK_ASSIGNED',
    title: 'Task created',
    message: `Task ${newTask.title} was created successfully.`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  activityLogs.unshift({
    id: activityLogs.length ? activityLogs[0].id + 1 : 1,
    userId: req.user.id,
    action: 'TASK_CREATED',
    entityType: 'task',
    entityId: newTask.id,
    description: `Created task ${newTask.title}.`,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newTask });
};

export const updateTask = (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  Object.assign(task, {
    ...req.body,
    updatedAt: new Date().toISOString()
  });

  return res.status(200).json({ success: true, data: task });
};

export const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return res.status(200).json({ success: true, message: 'Task deleted successfully', data: deletedTask });
};

export const updateTaskStatus = (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.status = req.body.status || task.status;
  task.updatedAt = new Date().toISOString();

  notifications.unshift({
    id: notifications.length ? notifications[0].id + 1 : 1,
    userId: task.assigneeId || req.user.id,
    type: 'TASK_STATUS_CHANGED',
    title: 'Task status updated',
    message: `Task ${task.title} changed to ${task.status}.`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return res.status(200).json({ success: true, data: task });
};

export const updateTaskAssignee = (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.assigneeId = Number(req.body.assigneeId) || task.assigneeId;
  task.updatedAt = new Date().toISOString();

  notifications.unshift({
    id: notifications.length ? notifications[0].id + 1 : 1,
    userId: task.assigneeId || req.user.id,
    type: 'TASK_ASSIGNED',
    title: 'New task assignment',
    message: `You were assigned to ${task.title}.`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return res.status(200).json({ success: true, data: task });
};

export const searchTasks = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({ success: true, data: tasks, total: tasks.length });
  }

  const result = tasks.filter((task) => task.title.toLowerCase().includes(q.toLowerCase()));
  return res.status(200).json({ success: true, data: result, total: result.length });
};
