# Finance Data Processing and Access Control Backend

A RESTful API backend for a finance dashboard system built with Node.js, Express, MySQL, and Sequelize ORM. The system supports role-based access control, financial records management, and dashboard analytics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure
finance-backend/
├── config/
│   └── database.js
├── models/
│   ├── index.js
│   ├── User.js
│   └── Transaction.js
├── middlewares/
│   ├── auth.js
│   ├── roleCheck.js
│   └── errorHandler.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── transactionController.js
│   └── dashboardController.js
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── transactionService.js
│   └── dashboardService.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── transactionRoutes.js
│   └── dashboardRoutes.js
├── validations/
│   ├── authValidation.js
│   └── transactionValidation.js
├── utils/
│   └── responseHelper.js
├── .env
├── .env.example
├── app.js
└── server.js

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL

### Installation

1. Clone the repository
    bash
git clone https://github.com/tanishka462/finance-backend.git
cd finance-backend

2. Install dependencies
bash
npm install


3. Create a `.env` file in the root directory
env
PORT=5000
DB_HOST=localhost
DB_NAME=finance_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development

4. Create MySQL database
    sql
CREATE DATABASE finance_db;


5. Start the server
    bash
# Development
npm run dev

# Production
npm start


The server will automatically create all required tables on startup.


## Roles and Permissions

| Action                  | Viewer | Analyst | Admin |
|-------------------------|--------|---------|-------|
| Register / Login        | ✅     | ✅      | ✅    |
| View Transactions       | ✅     | ✅      | ✅    |
| Create Transaction      | ❌     | ✅      | ✅    |
| Update Transaction      | ❌     | ✅      | ✅    |
| Delete Transaction      | ❌     | ❌      | ✅    |
| View Recent Activity    | ✅     | ✅      | ✅    |
| View Dashboard Summary  | ❌     | ✅      | ✅    |
| View Category Totals    | ❌     | ✅      | ✅    |
| View Monthly Trends     | ❌     | ✅      | ✅    |
| Manage Users            | ❌     | ❌      | ✅    |

## API Endpoints

### Auth Routes

| Method | Endpoint           | Access | Description         |
|--------|--------------------|--------|---------------------|
| POST   | /api/auth/register | Public | Register a new user |
| POST   | /api/auth/login    | Public | Login user          |
| GET    | /api/auth/me       | All    | Get logged in user  |

#### Register
    json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456",
  "role": "admin"
}


#### Login
    json
POST /api/auth/login
{
  "email": "john@gmail.com",
  "password": "123456"
}

### User Routes (Admin Only)

| Method | Endpoint       | Description     |
|--------|----------------|-----------------|
| GET    | /api/users     | Get all users   |
| GET    | /api/users/:id | Get single user |
| PATCH  | /api/users/:id | Update user     |
| DELETE | /api/users/:id | Delete user     |

#### Query Parameters for GET /api/users

| Parameter | Type    | Description                  |
|-----------|---------|------------------------------|
| page      | number  | Page number (default: 1)     |
| limit     | number  | Items per page (default: 10) |
| role      | string  | Filter by role               |
| is_active | boolean | Filter by status             |


### Transaction Routes

| Method | Endpoint              | Access         | Description            |
|--------|-----------------------|----------------|------------------------|
| GET    | /api/transactions     | All            | Get all transactions   |
| GET    | /api/transactions/:id | All            | Get single transaction |
| POST   | /api/transactions     | Admin, Analyst | Create transaction     |
| PUT    | /api/transactions/:id | Admin, Analyst | Update transaction     |
| DELETE | /api/transactions/:id | Admin          | Delete transaction     |

#### Create Transaction
    json
POST /api/transactions
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-03-01",
  "notes": "Monthly salary"
}


#### Query Parameters for GET /api/transactions

| Parameter  | Type   | Description                   |
|------------|--------|-------------------------------|
| page       | number | Page number (default: 1)      |
| limit      | number | Items per page (default: 10)  |
| type       | string | Filter by income or expense   |
| category   | string | Filter by category            |
| start_date | date   | Filter from date (YYYY-MM-DD) |
| end_date   | date   | Filter to date (YYYY-MM-DD)   |



### Dashboard Routes

| Method | Endpoint                   | Access         | Description                    |
|--------|----------------------------|----------------|--------------------------------|
| GET    | /api/dashboard/summary     | Admin, Analyst | Total income, expense, balance |
| GET    | /api/dashboard/by-category | Admin, Analyst | Category wise totals           |
| GET    | /api/dashboard/trends      | Admin, Analyst | Monthly trends                 |
| GET    | /api/dashboard/recent      | All            | Recent transactions            |

#### Query Parameters for GET /api/dashboard/recent

| Parameter | Type   | Description                     |
|-----------|--------|---------------------------------|
| limit     | number | Number of records (default: 10) |


## Response Format

### Success Response
    json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}


### Paginated Response
    json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}


### Error Response
    json
{
  "success": false,
  "message": "Error message",
  "errors": []
}


## Authentication

All protected routes require a Bearer token in the Authorization header:
Authorization: Bearer <your_jwt_token>

## Rate Limiting

To protect the API from abuse, rate limiting is applied:

| Route          | Limit                        |
|----------------|------------------------------|
| All Routes     | 100 requests per 15 minutes  |
| /auth/register | 10 requests per 15 minutes   |
| /auth/login    | 10 requests per 15 minutes   |

If limit is exceeded, the API returns:
    json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}

## Assumptions

- First registered user can be assigned any role including admin directly during registration. In a production system, admin creation would be restricted.
- Soft delete is implemented for transactions. Deleted transactions are not shown in any listing or analytics.
- Transaction date cannot be a future date.
- An admin cannot deactivate or delete their own account.
- An admin cannot change their own role.
- Notes field in transactions is optional and limited to 500 characters.
- Monthly trends return last 24 months of data.

## Error Handling

The system handles the following errors globally:

- Sequelize Validation Errors → 400
- Sequelize Unique Constraint Errors → 409
- Sequelize Database Errors → 400
- Sequelize Connection Errors → 503
- JWT Invalid Token → 401
- JWT Expired Token → 401
- Not Found Routes → 404
- Unauthorized Access → 401
- Forbidden Access → 403
- Internal Server Errors → 500