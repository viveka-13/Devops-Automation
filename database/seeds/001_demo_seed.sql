USE taskflow_pro;

INSERT INTO roles (name) VALUES
  ('ADMINISTRATOR'),
  ('PROJECT_MANAGER'),
  ('TEAM_MEMBER'),
  ('VIEWER');

INSERT INTO users (full_name, email, password_hash, avatar_url, role_id, is_active) VALUES
  ('Alice Johnson', 'alice@taskflowpro.dev', '$2a$10$Q4v4Y0cI0Gv8Q5LKaP0hce1eKp9P2d3e1Da8mKh8z3ZKTi1oTj96G', 'https://example.com/avatar/alice.png', 1, TRUE),
  ('Bob Smith', 'bob@taskflowpro.dev', '$2a$10$Q4v4Y0cI0Gv8Q5LKaP0hce1eKp9P2d3e1Da8mKh8z3ZKTi1oTj96G', 'https://example.com/avatar/bob.png', 2, TRUE),
  ('Carol White', 'carol@taskflowpro.dev', '$2a$10$Q4v4Y0cI0Gv8Q5LKaP0hce1eKp9P2d3e1Da8mKh8z3ZKTi1oTj96G', 'https://example.com/avatar/carol.png', 3, TRUE),
  ('David Brown', 'david@taskflowpro.dev', '$2a$10$Q4v4Y0cI0Gv8Q5LKaP0hce1eKp9P2d3e1Da8mKh8z3ZKTi1oTj96G', 'https://example.com/avatar/david.png', 4, TRUE);

INSERT INTO projects (name, description, owner_id, status, start_date, due_date) VALUES
  ('Website Redesign', 'Complete website redesign for the marketing team.', 1, 'ACTIVE', '2026-09-01', '2026-09-30'),
  ('Mobile App Launch', 'Prepare the application launch checklist for mobile teams.', 2, 'ACTIVE', '2026-09-05', '2026-10-15');

INSERT INTO project_members (project_id, user_id, role) VALUES
  (1, 1, 'ADMIN'),
  (1, 2, 'MANAGER'),
  (1, 3, 'MEMBER'),
  (2, 2, 'ADMIN'),
  (2, 3, 'MEMBER'),
  (2, 4, 'VIEWER');

INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, creator_id, due_date, estimated_hours, actual_hours) VALUES
  (1, 'Create homepage wireframes', 'Draft wireframes for the redesigned landing page.', 'IN_PROGRESS', 'HIGH', 3, 1, '2026-09-20', 12.00, 8.00),
  (1, 'Finalize CTA copy', 'Review copy for call-to-action sections.', 'TODO', 'MEDIUM', 2, 1, '2026-09-22', 5.00, 0.00),
  (2, 'QA app onboarding flow', 'Validate login and onboarding flow for release QA.', 'IN_REVIEW', 'CRITICAL', 3, 2, '2026-09-28', 16.00, 10.00),
  (2, 'Prepare launch checklist', 'Complete launch readiness checklist.', 'DONE', 'HIGH', 4, 2, '2026-09-18', 8.00, 8.00);

INSERT INTO task_labels (task_id, label) VALUES
  (1, 'design'),
  (1, 'homepage'),
  (2, 'content'),
  (3, 'qa'),
  (4, 'launch');

INSERT INTO comments (task_id, user_id, content) VALUES
  (1, 1, 'Initial wireframe is ready for review.'),
  (3, 2, 'Please check the new onboarding states for dark mode.'),
  (4, 4, 'Launch checklist has been completed.');

INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id) VALUES
  (3, 'TASK_ASSIGNED', 'Task assigned', 'You were assigned to Create homepage wireframes.', 'task', 1),
  (2, 'TASK_STATUS_CHANGED', 'Status update', 'QA app onboarding flow moved to IN_REVIEW.', 'task', 3),
  (4, 'PROJECT_INVITATION', 'Project invitation', 'You have been added to Mobile App Launch.', 'project', 2);

INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES
  (1, 'LOGIN', 'user', 1, 'User logged in successfully.'),
  (1, 'PROJECT_CREATED', 'project', 1, 'Created Website Redesign.'),
  (2, 'TASK_CREATED', 'task', 3, 'Created QA app onboarding flow.'),
  (3, 'COMMENT_ADDED', 'comment', 2, 'Added a comment to the onboarding task.');
