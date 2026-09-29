import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('GET /api/health returns success payload', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'ok');
});

test('POST /api/auth/register creates a user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.user.email, 'testuser@example.com');
});

test('POST /api/auth/register rejects duplicate email', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Another User',
      email: 'duplicate@example.com',
      password: 'password123'
    });

  const response = await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Duplicate User',
      email: 'duplicate@example.com',
      password: 'password123'
    });

  assert.equal(response.status, 409);
  assert.equal(response.body.message, 'Email already registered');
});

test('POST /api/auth/login authenticates valid user', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.token);
});

test('POST /api/auth/login rejects invalid password', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'wrongpassword'
    });

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Invalid email or password');
});
