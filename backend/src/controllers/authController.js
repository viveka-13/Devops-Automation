import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, activityLogs } from '../data/store.js';

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'devjwtsecret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const register = async (req, res) => {
  const { fullName, email, password, role = 'TEAM_MEMBER' } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    fullName,
    email,
    passwordHash,
    role,
    isActive: true,
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);

  activityLogs.unshift({
    id: activityLogs.length ? activityLogs[0].id + 1 : 1,
    userId: newUser.id,
    action: 'REGISTER',
    entityType: 'user',
    entityId: newUser.id,
    description: 'User registered successfully.',
    createdAt: new Date().toISOString()
  });

  const token = signToken(newUser);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);

  activityLogs.unshift({
    id: activityLogs.length ? activityLogs[0].id + 1 : 1,
    userId: user.id,
    action: 'LOGIN',
    entityType: 'user',
    entityId: user.id,
    description: 'User logged in successfully.',
    createdAt: new Date().toISOString()
  });

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
};

export const me = (req, res) => {
  const user = users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive
    }
  });
};

export const logout = (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
