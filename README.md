# Task Manager Frontend

React + TypeScript frontend for task management, connected to a backend API.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- Backend running at `http://localhost:8000`

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Production Build

```bash
npm run build
```

## Build Preview

```bash
npm run preview
```

## API Integration

- Backend base URL: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

Used endpoints:

- `POST /register`
- `POST /login`
- `GET /users/me`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/{task_id}`
- `DELETE /tasks/{task_id}`

## Authentication

- The JWT token (`access_token`) is stored in `localStorage` under the `auth_token` key.
- Authenticated requests send:

```http
Authorization: Bearer <access_token>
```

- On app startup, the session is restored via `GET /users/me`.
- If a `401` response is returned, the user is logged out and redirected to the login screen.

## Useful Structure

- `src/services/api.ts`: API access layer (auth, user, tasks, error handling)
- `src/App.tsx`: session bootstrap + app routing
- `src/pages/LoginPage.tsx`: login form and error handling
- `src/pages/RegisterPage.tsx`: register form and API submission
- `src/pages/Dashboard.tsx`: task loading and CRUD operations

