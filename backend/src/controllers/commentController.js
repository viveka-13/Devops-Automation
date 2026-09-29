import { comments, activityLogs } from '../data/store.js';

export const listComments = (req, res) => {
  const taskComments = comments.filter((comment) => comment.taskId === Number(req.params.taskId));
  return res.status(200).json({ success: true, data: taskComments, total: taskComments.length });
};

export const addComment = (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Comment content is required' });
  }

  const newComment = {
    id: comments.length ? comments[comments.length - 1].id + 1 : 1,
    taskId: Number(req.params.taskId),
    userId: req.user.id,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  comments.unshift(newComment);

  activityLogs.unshift({
    id: activityLogs.length ? activityLogs[0].id + 1 : 1,
    userId: req.user.id,
    action: 'COMMENT_ADDED',
    entityType: 'comment',
    entityId: newComment.id,
    description: 'A comment was added to a task.',
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newComment });
};

export const updateComment = (req, res) => {
  const comment = comments.find((item) => item.id === Number(req.params.id));

  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only edit your own comments' });
  }

  comment.content = req.body.content || comment.content;
  comment.updatedAt = new Date().toISOString();

  return res.status(200).json({ success: true, data: comment });
};

export const deleteComment = (req, res) => {
  const comment = comments.find((item) => item.id === Number(req.params.id));

  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  if (comment.userId !== req.user.id && req.user.role !== 'ADMINISTRATOR' && req.user.role !== 'PROJECT_MANAGER') {
    return res.status(403).json({ success: false, message: 'You do not have permission to delete this comment' });
  }

  const index = comments.findIndex((item) => item.id === Number(req.params.id));
  comments.splice(index, 1);

  return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
};
