import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

let token = '';
let taskId = 0;
let commentId = 0;

test('register a user for comment tests', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Comment User',
      email: 'commentuser@example.com',
      password: 'password123',
      role: 'PROJECT_MANAGER'
    });

  token = response.body.token;
  assert.equal(response.status, 201);
});

test('create a task to attach comments', async () => {
  const projectResponse = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Comment Project',
      description: 'For comment validation',
      dueDate: '2026-12-15',
      status: 'ACTIVE'
    });

  const taskResponse = await request(app)
    .post(`/api/projects/${projectResponse.body.data.id}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Comment task',
      description: 'Write a comment on this task',
      priority: 'MEDIUM',
      status: 'TODO'
    });

  taskId = taskResponse.body.data.id;
  assert.equal(taskResponse.status, 201);
});

test('POST /api/tasks/:taskId/comments adds a comment', async () => {
  const response = await request(app)
    .post(`/api/tasks/${taskId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ content: 'This is a test comment.' });

  commentId = response.body.data.id;
  assert.equal(response.status, 201);
  assert.equal(response.body.data.content, 'This is a test comment.');
});

test('PUT /api/comments/:id updates only own comment', async () => {
  const response = await request(app)
    .put(`/api/comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ content: 'Updated comment content.' });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.content, 'Updated comment content.');
});

test('GET /api/notifications returns notifications', async () => {
  const response = await request(app)
    .get('/api/notifications')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
});

test('PATCH /api/notifications/read-all marks all as read', async () => {
  const response = await request(app)
    .patch('/api/notifications/read-all')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'All notifications marked as read');
});
