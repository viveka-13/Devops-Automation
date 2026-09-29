import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listComments, addComment, updateComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/tasks/:taskId/comments', authenticate, listComments);
router.post('/tasks/:taskId/comments', authenticate, addComment);
router.put('/comments/:id', authenticate, updateComment);
router.delete('/comments/:id', authenticate, authorize('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER'), deleteComment);

export default router;
