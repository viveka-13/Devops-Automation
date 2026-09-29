export const users = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@taskflowpro.dev',
    passwordHash: '$2a$10$Q4v4Y0cI0Gv8Q5LKaP0hce1eKp9P2d3e1Da8mKh8z3ZKTi1oTj96G',
    role: 'ADMINISTRATOR',
    isActive: true,
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Marketing website redesign project',
    ownerId: 1,
    status: 'ACTIVE',
    startDate: '2026-09-01',
    dueDate: '2026-09-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [1]
  }
];

export const tasks = [
  {
    id: 1,
    projectId: 1,
    title: 'Create homepage mockups',
    description: 'Design the homepage wireframes and decision points.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeId: 1,
    creatorId: 1,
    dueDate: '2026-09-20',
    estimatedHours: 12,
    actualHours: 0,
    labels: ['design', 'homepage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const comments = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    content: 'Initial mockups are ready for review.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const notifications = [
  {
    id: 1,
    userId: 1,
    type: 'TASK_ASSIGNED',
    title: 'Task assigned',
    message: 'You were assigned to create homepage mockups.',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export const activityLogs = [
  {
    id: 1,
    userId: 1,
    action: 'LOGIN',
    entityType: 'user',
    entityId: 1,
    description: 'User logged in successfully.',
    createdAt: new Date().toISOString()
  }
];
