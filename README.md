# A4

9065 A4

## Features

-

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB Atlas
- JWT (JSON Web Tokens)
- bcryptjs for password hashing
- express-rate-limit

### Frontend

- React
- React Router
- Context API
- Fetch API
- Styled Components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install all dependencies at once
npm install express mongoose cors bcryptjs jsonwebtoken dotenv express-rate-limit
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/userauth
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# Install additional dependencies
npm install react-router-dom
```

### 4. Start the Application

Start the backend server:

```bash
cd backend
npm install
npm start
```

Start the frontend development server:

```bash
cd frontend
npm install
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Admin Account

After starting the server for the first time, a default admin account will be created:

- Email: admin@example.com
- Password: admin123

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/dashboard` - Protected route example

### Database Access

1. Each team member should create their own MongoDB Atlas database user
2. Share the cluster connection string (without credentials)
3. Each member should use their own credentials in their `.env` file
4. Maintain the same JWT_SECRET across the team

### Environment Variables

- Never commit `.env` files to version control
- Use `.env.example` as a template
- Each team member should maintain their own `.env` file
