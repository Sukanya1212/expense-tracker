# 💰 Expense Tracker - MERN Stack Application

A complete, production-ready expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring authentication, transaction management, filtering, and beautiful data visualizations.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🔐 Authentication
- User signup with password hashing (bcrypt)
- JWT-based authentication
- Protected routes and middleware
- Persistent login sessions

### 💸 Transaction Management
- Add, edit, and delete transactions
- Income and expense tracking
- Category-based organization (Food, Travel, Rent, Shopping, Salary, Other)
- Notes for each transaction
- Date tracking

### 📊 Dashboard & Analytics
- Total income, expense, and balance overview
- Monthly income vs expense bar chart
- Category-wise expense pie chart
- Real-time statistics

### 🔍 Advanced Features
- Filter by date range
- Filter by category
- Search transactions by notes
- Pagination support
- Responsive mobile design

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Language**: TypeScript
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Form Validation**: Yup
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Date Handling**: date-fns

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── transactionController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Transaction.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── transactionRoutes.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FilterBar.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── StatsCard.tsx
    │   │   ├── TransactionCard.tsx
    │   │   └── TransactionModal.tsx
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── Login.tsx
    │   │   ├── Signup.tsx
    │   │   └── Transactions.tsx
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.ts
    │   │   │   └── transactionSlice.ts
    │   │   └── store.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── useRedux.ts
    │   ├── utils/
    │   │   └── api.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

   **Important**: Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.

4. **Start the backend server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm run build
   npm start
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Transaction Endpoints

**Note**: All transaction endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

#### 3. Get All Transactions
```http
GET /api/transactions?page=1&limit=10&category=Food&startDate=2024-01-01&endDate=2024-12-31&search=grocery
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category (Food, Travel, Rent, Shopping, Salary, Other)
- `startDate` (optional): Filter transactions from this date (YYYY-MM-DD)
- `endDate` (optional): Filter transactions until this date (YYYY-MM-DD)
- `search` (optional): Search in transaction notes

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "userId": "user_id",
        "type": "expense",
        "amount": 500,
        "category": "Food",
        "date": "2024-11-27T00:00:00.000Z",
        "note": "Grocery shopping",
        "createdAt": "2024-11-27T10:00:00.000Z",
        "updatedAt": "2024-11-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5
    }
  }
}
```

#### 4. Get Single Transaction
```http
GET /api/transactions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "income",
    "amount": 5000,
    "category": "Salary",
    "date": "2024-11-27T00:00:00.000Z",
    "note": "Monthly salary",
    "createdAt": "2024-11-27T10:00:00.000Z",
    "updatedAt": "2024-11-27T10:00:00.000Z"
  }
}
```

#### 5. Create Transaction
```http
POST /api/transactions
```

**Request Body:**
```json
{
  "type": "expense",
  "amount": 500,
  "category": "Food",
  "date": "2024-11-27",
  "note": "Dinner at restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "expense",
    "amount": 500,
    "category": "Food",
    "date": "2024-11-27T00:00:00.000Z",
    "note": "Dinner at restaurant",
    "createdAt": "2024-11-27T10:00:00.000Z",
    "updatedAt": "2024-11-27T10:00:00.000Z"
  }
}
```

#### 6. Update Transaction
```http
PUT /api/transactions/:id
```

**Request Body:**
```json
{
  "amount": 600,
  "note": "Updated dinner cost"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "expense",
    "amount": 600,
    "category": "Food",
    "date": "2024-11-27T00:00:00.000Z",
    "note": "Updated dinner cost",
    "createdAt": "2024-11-27T10:00:00.000Z",
    "updatedAt": "2024-11-27T11:00:00.000Z"
  }
}
```

#### 7. Delete Transaction
```http
DELETE /api/transactions/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

#### 8. Get Dashboard Statistics
```http
GET /api/transactions/stats/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpense": 30000,
    "balance": 20000,
    "categoryStats": {
      "Food": { "income": 0, "expense": 5000 },
      "Salary": { "income": 50000, "expense": 0 },
      "Travel": { "income": 0, "expense": 10000 }
    },
    "monthlyData": [
      {
        "_id": { "year": 2024, "month": 11, "type": "income" },
        "total": 50000
      },
      {
        "_id": { "year": 2024, "month": 11, "type": "expense" },
        "total": 30000
      }
    ]
  }
}
```

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface

### Visual Elements
- Gradient backgrounds
- Smooth animations
- Interactive charts
- Color-coded transactions (green for income, red for expense)
- Category icons

### User Experience
- Loading states
- Error handling
- Empty states
- Form validation with helpful error messages
- Confirmation dialogs for destructive actions

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes
- HTTP-only token storage
- Input validation on both client and server
- MongoDB injection prevention

## 🧪 Testing the Application

1. **Start both servers** (backend on port 5000, frontend on port 3000)
2. **Create an account** using the signup page
3. **Login** with your credentials
4. **Add transactions** using the "Add Transaction" button
5. **View dashboard** to see charts and statistics
6. **Filter transactions** by category, date, or search
7. **Edit/Delete** transactions as needed

##  License

ISC

## 👨‍💻 Author
Sukanya Gupta
Built with using the MERN stack
