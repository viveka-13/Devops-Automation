import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

let authToken = '';
let projectId = 0;
let taskId = 0;

test('register manager user for task tests', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Task Manager',
      email: 'taskmanager@example.com',
      password: 'password123',
      role: 'PROJECT_MANAGER'
    });

  authToken = response.body.token;
  assert.equal(response.status, 201);
});

test('create project for task workflow', async () => {
  const response = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      name: 'Task Workflow Project',
      description: 'Used for task tests',
      dueDate: '2026-11-15',
      status: 'ACTIVE'
    });

  projectId = response.body.data.id;
  assert.equal(response.status, 201);
  assert.equal(response.body.data.name, 'Task Workflow Project');
});

test('POST /api/projects/:projectId/tasks creates a task', async () => {
  const response = await request(app)
    .post(`/api/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Build task board UI',
      description: 'Implement the task board layout',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: '2026-11-20'
    });

  taskId = response.body.data.id;
  assert.equal(response.status, 201);
  assert.equal(response.body.data.title, 'Build task board UI');
});

test('GET /api/tasks/search finds task by title', async () => {
  const response = await request(app)
    .get('/api/tasks/search')
    .query({ q: 'task board' })
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(response.status, 200);
  assert.ok(response.body.data.some((task) => task.title.includes('task board')));
});

test('PATCH /api/tasks/:id/status updates task status', async () => {
  const response = await request(app)
    .patch(`/api/tasks/${taskId}/status`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ status: 'IN_PROGRESS' });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, 'IN_PROGRESS');
});

test('GET /api/tasks returns filtered tasks by project and status', async () => {
  const response = await request(app)
    .get('/api/tasks')
    .query({ projectId, status: 'IN_PROGRESS' })
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(response.status, 200);
  assert.ok(response.body.data.some((task) => task.projectId === projectId));
});

