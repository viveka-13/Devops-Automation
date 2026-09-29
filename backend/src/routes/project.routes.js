import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  archiveProject,
  getProjectTasks,
  createTask,
  dashboard
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects', authenticate, listProjects);
router.post('/projects', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER'), createProject);
router.get('/projects/:id', authenticate, getProjectById);
router.put('/projects/:id', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER'), updateProject);
router.patch('/projects/:id/archive', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER'), archiveProject);
router.get('/projects/:projectId/tasks', authenticate, getProjectTasks);
router.post('/projects/:projectId/tasks', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER'), createTask);
router.get('/dashboard', authenticate, dashboard);

export default router;
