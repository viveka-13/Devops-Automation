# TaskFlow Pro

TaskFlow Pro is a collaborative project and task management platform built as a full-stack application with DevOps automation, Docker support, and GitHub-based workflow demonstrations.

## Overview

This project is designed for a college portfolio and DevOps lab project. It covers the full software lifecycle: development, GitHub workflows, testing, Docker deployment, and CI/CD automation.

## Features

- Role-based project management
- Task tracking with status and priority
- Team collaboration and comments
- Dashboard analytics and activity history
- Secure authentication with JWT
- MySQL-backed persistence
- Docker Compose setup for local development
- GitHub Actions for CI/CD workflow demonstration

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT + bcrypt
- Validation: Joi
- DevOps: GitHub, Docker, CI/CD, GitHub Actions

## Prerequisites

- Node.js 18+
- npm
- MySQL 8+
- Docker Desktop (optional, for Compose)
- Git

## Local setup

1. Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

2. Update the values in `.env` for your local MySQL setup.

3. Install frontend dependencies:

```powershell
cd frontend
npm install
```

4. Install backend dependencies:

```powershell
cd ../backend
npm install
```

5. Start the backend:

```powershell
npm run dev
```

6. Start the frontend:

```powershell
cd ../frontend
npm run dev
```

## Docker setup

```powershell
docker compose up --build
```

To stop containers:

```powershell
docker compose down
```

## Project structure

```text
TaskFlow-Pro/
├── backend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── database/
├── docs/
├── .github/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
└── LICENSE
```

## Health check

Backend health endpoint:

```powershell
curl http://localhost:5000/api/health
```

## License

This project is intended for academic and portfolio use.
