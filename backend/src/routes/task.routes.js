import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskAssignee,
  searchTasks
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', authenticate, listTasks);
router.get('/tasks/search', authenticate, searchTasks);
router.post('/projects/:projectId/tasks', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER'), createTask);
router.get('/tasks/:id', authenticate, getTaskById);
router.put('/tasks/:id', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER'), updateTask);
router.delete('/tasks/:id', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER'), deleteTask);
router.patch('/tasks/:id/status', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER'), updateTaskStatus);
router.patch('/tasks/:id/assignee', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER'), updateTaskAssignee);

export default router;
