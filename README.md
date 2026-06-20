# MERN Task Manager

## Project Overview

A full-stack task manager where users can create an account and manage their own tasks. The dashboard is built with React and Bootstrap, while the Express API handles authentication and stores data in MongoDB.

## Features

- User registration and login
- JWT authentication and protected routes
- Create, edit, and delete tasks
- Status, priority, and due date fields
- Dashboard task counts
- Search tasks by title
- Filter by status and priority
- Sort by newest, oldest, or due date
- Pagination with five tasks per page
- Loading states, empty states, confirmation modal, and toast messages
- Responsive Bootstrap layout

## Tech Stack

**Frontend**

- React 18 and Vite
- React Router
- Axios
- Context API
- Bootstrap 5

**Backend**

- Node.js and Express
- MongoDB and Mongoose
- JWT and bcryptjs
- express-rate-limit
- dotenv and CORS

## Folder Structure

```text
task-manager/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- vite.config.js
|   `-- package.json
|-- IMPLEMENTATION.md
|-- THEORY_ANSWERS.md
|-- TaskManager.postman_collection.json
`-- README.md
```

## Installation Steps

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`, then start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend`, then start Vite:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Environment Variables

### Backend: `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | No |
| POST | `/api/auth/login` | Log in | No |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Get the current user's tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

Protected endpoints require:

```http
Authorization: Bearer <token>
```

## Deployment Instructions

This project uses MongoDB Atlas for the database, Render for the backend, and Vercel for the frontend.

### 1. MongoDB Atlas

1. Create a MongoDB Atlas project and cluster.
2. Create a database user.
3. Allow network access for the Render server. For a simple assignment deployment, `0.0.0.0/0` can be used with a strong database password.
4. Copy the connection string and replace its username, password, and database name.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
```

### 2. Backend on Render

1. Push the project to GitHub.
2. Create a new Render Web Service from the repository.
3. Set the root directory to `backend`.
4. Use `npm install` as the build command.
5. Use `npm start` as the start command.
6. Add these environment variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

Render provides `PORT` automatically, so it does not need to be added manually.

### 3. Frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Keep the framework preset as Vite.
4. Add the backend API URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

5. Deploy the frontend.
6. Update `CLIENT_URL` on Render with the final Vercel URL and redeploy the backend.

## More Documentation

- [Implementation Notes](./IMPLEMENTATION.md)
- [Theory Answers](./THEORY_ANSWERS.md)
