# 📚 LMS Backend API

A **Node.js + Express + MongoDB** based backend for a Learning Management System (LMS).
The project follows a **clean MVC architecture** with **authentication, role-based authorization, middleware validation, and analytics APIs**.

---

# 🚀 Features

* User Management (Create, Update, Delete)
* Course Management
* Course Enrollment
* Role-Based Access Control (Admin / Instructor / Student)
* JWT Authentication
* Request Validation Middleware
* Centralized Error Handling
* Analytics APIs (User & Course insights)
* Modular MVC Architecture

---

# 🏗️ Project Architecture

```
LMS-Backend
│
├── controllers
│   ├── user.js
│   ├── course.js
│   └── analyticsController.js
│
├── middlewares
│   ├── authmiddleware.js
│   ├── rolemiddleware.js
│   ├── validation.js
│   └── errorHandler.js
│
├── models
│   ├── usermodels.js
│   └── coursemodels.js
│
├── routes
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   └── analyticsRoutes.js
│
├── .env
├── index.js
└── package.json
```

---

# ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**
* **REST API Architecture**

---

# 🔑 Authentication System

The project uses **JWT (JSON Web Token)** authentication.

When a user logs in:

```
POST /users/login
```

The server generates:

* **Access Token**
* **Refresh Token**

Example response:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

Protected routes require:

```
Authorization: Bearer ACCESS_TOKEN
```

---

# 🧑‍💻 User API Endpoints

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | /users/login          | Login user           |
| POST   | /users                | Create user          |
| POST   | /users/create         | Create user (manual) |
| GET    | /users                | Get all users        |
| GET    | /users/role           | Get users by role    |
| GET    | /users/search         | Search users         |
| GET    | /users/advance-filter | Advanced filtering   |
| PUT    | /users/:id            | Update user          |
| DELETE | /users/:id            | Delete user          |
| POST   | /users/:id/enroll     | Enroll in course     |

---

# 📚 Course API Endpoints

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /courses              | Create course          |
| POST   | /courses/create       | Create course (manual) |
| GET    | /courses              | Get courses            |
| GET    | /courses/filter       | Filter courses         |
| GET    | /courses/search       | Search courses         |
| PUT    | /courses/:id          | Update course          |
| DELETE | /courses/:id          | Delete course          |
| GET    | /courses/:id/enrolled | Get enrolled students  |

---

# 📊 Analytics API

| Endpoint                     | Description              |
| ---------------------------- | ------------------------ |
| /analytics/user-count        | Total users              |
| /analytics/user-report       | Active user statistics   |
| /analytics/course-count      | Courses by category      |
| /analytics/course-popularity | Most popular courses     |
| /analytics/course-progress   | Course duration insights |
| /analytics/engagement        | Engagement report        |
| /analytics/summary           | Overall summary          |
| /analytics/custom-report     | Custom analytics report  |

---

# 🔐 Middleware System

### Authentication Middleware

Validates JWT token.

```
authMiddleware
```

Used on protected routes.

---

### Role Middleware

Restricts routes based on user roles.

Example:

```
roleMiddleware('admin')
roleMiddleware('admin','instructor')
```

---

### Validation Middleware

Validates request body for:

* User creation
* Login requests

---

### Error Handler

Centralized error handling for API responses.

---

# 📦 Installation

### 1️⃣ Clone Repository

```
https://github.com/DivyamChitransh/Learning-Management-System.git
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Configure Environment

Create `.env` file:

```
PORT=8081
MONGO_URI=mongodb://localhost:27017/LMS-DB
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

---

### 4️⃣ Run Server

```
node index.js
```

or

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

# 🔄 API Request Flow

```
Client
   ↓
Routes
   ↓
Middleware (Auth / Role / Validation)
   ↓
Controller
   ↓
MongoDB Database
```

---

# 🧪 Example Protected Request

```
GET /courses
```

Headers:

```
Authorization: Bearer ACCESS_TOKEN
```

---

# 📈 Future Improvements

* Password hashing using **bcrypt**
* Refresh token validation
* Logout system
* Rate limiting

