import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

let authToken = '';

test('register admin for project testing', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Project Admin',
      email: 'projectadmin@example.com',
      password: 'password123',
      role: 'PROJECT_MANAGER'
    });

  authToken = response.body.token;
  assert.equal(response.status, 201);
});

test('GET /api/projects returns projects list for authenticated user', async () => {
  const response = await request(app)
    .get('/api/projects')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
});

test('POST /api/projects creates a project', async () => {
  const response = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      name: 'Alpha Project',
      description: 'Project for testing',
      dueDate: '2026-10-30',
      status: 'ACTIVE'
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.name, 'Alpha Project');
});

test('GET /api/dashboard returns dashboard summary', async () => {
  const response = await request(app)
    .get('/api/dashboard')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(response.status, 200);
  assert.ok(response.body.data.totalProjects >= 1);
});
