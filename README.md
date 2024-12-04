# Lab Assignment #4

Project - Online Computer Store Web Application

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

Create a `.env` file in the backend directory (This mongoDB URI is for testing purposes only):

```env
PORT=5000
MONGODB_URI=mongodb+srv://testUser:test123@cluster0.nqrmi.mongodb.net/userauth
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_51QNPREP4t6UXnB3YukWKNWj4tDmWADzc5v1jWbtjK6RiOuxJu7BcZr3A1aKGs5K3LXB5P8r3fJeVgYOOe6Cf5dlr00kANf5owx
FRONTEND_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
CLIENT_URL=http://localhost:3000
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

## Test User Account

testing user account:

- Email: 1@test.com
- Password: 1

## Test bank card information

- Card Number: 4242 4242 4242 4242
- Expiration Date: 11/31
- CVC: 111

### Authentication

- `POST /api/auth/register` - User registration

  - Body: `{ email, password, role }`
  - Response: `{ token, user }`

- `POST /api/auth/login` - User/Admin login
  - Body: `{ email, password }`
  - Response: `{ token, user, role }`

### Protected Routes

#### User Routes

- `GET /api/orders/history` - Get user's order history
- `POST /api/orders/update-status` - Update order status
- `GET /api/dashboard` - User dashboard

#### Admin Routes

- `GET /api/orders/all` - Get all orders (admin only)
- `PUT /api/orders/:id/cancel` - Cancel an order (admin only)
- `PUT /api/products/:id` - Update product inventory (admin only)

### Authorization

All protected routes require a valid JWT token in the Authorization header:

### Database Access

1. Each team member should create their own MongoDB Atlas database user
2. Share the cluster connection string (without credentials)
3. Each member should use their own credentials in their `.env` file
4. Maintain the same JWT_SECRET across the team

### Environment Variables

- Never commit `.env` files to version control
- Each team member should maintain their own `.env` file
