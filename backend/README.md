# Backend API - Delivery Management System

## 📋 Description
RESTful API backend for Delivery Management System built with Node.js, Express, and Sequelize ORM. Features comprehensive API documentation with Swagger UI and complete testing guides for both Postman and Swagger.

## 🛠️ Tech Stack
- **Node.js** v22.20.0
- **Express.js** v5.1.0
- **Sequelize** v6.37.7
- **MS SQL Server** 2022
- **JWT** for authentication
- **Swagger UI Express** v5.x - Interactive API documentation
- **Swagger JSDoc** v6.x - OpenAPI 3.0 specification

## 📁 Project Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication & validation
├── models/          # Sequelize models
├── routes/          # API routes
├── server.js        # Entry point
└── seed.js          # Database seeding
```

## ⚙️ Setup

### 1. Prerequisites
- Node.js v22.20.0 or higher
- MS SQL Server 2022
- Database `QuanLyGiaoHang_Nhom06` already created with schema

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Database
Edit `config/db.config.js` if needed (default values):
```javascript
HOST: "localhost",
USER: "sManager",
PASSWORD: "Nhom6251",
DB: "QuanLyGiaoHang_Nhom06",
port: 1433
```

### 4. Seed Database (One-time Setup)
```bash
node seed.js
```
This will:
- Create SQL Server login `sManager` (if not exists)
- Create admin user in database (username: `admin`, password: `admin123`)

### 5. Start Server
```bash
node server.js
```
Server will run at: **http://localhost:3000**

### 6. Test API
Login to get JWT token:
```bash
POST http://localhost:3000/api/auth/login
Body: {"username": "admin", "password": "admin123"}
```
Use the token in Authorization header for other endpoints:
```
Authorization: Bearer <your_token>
```

## 📚 API Documentation

### 🌐 Interactive Documentation - Swagger UI
Access interactive API documentation at: **http://localhost:3000/api-docs**

**Features:**
- 🔍 Browse all 14 API endpoints with detailed schemas
- 🧪 Test APIs directly in browser with "Try it out" button
- 🔐 Built-in JWT authentication with "Authorize" button
- 📖 Auto-generated from code comments (always up-to-date)
- 💾 Download responses and copy cURL commands
- 🎨 Clean UI with organized endpoint groups

**Quick Start:**
1. Start server: `node server.js`
2. Open browser: http://localhost:3000/api-docs
3. Login via POST /api/auth/login → Copy token
4. Click "Authorize" 🔓 → Paste token → Click "Authorize"
5. Test any endpoint with "Try it out"

See `TEST_GUIDE_SWAGGER.md` for comprehensive Swagger UI testing guide.

---

### 📮 Testing with Postman
Complete Postman collection with 29 test cases available in `TEST_GUIDE_POSTMAN.md`.

**Features:**
- ✅ Pre-configured environment variables
- ✅ Auto-save JWT token after login
- ✅ Test scripts for validation
- ✅ JSON collection template for import
- ✅ Full request/response examples

---

### 🔌 API Endpoints

#### Authentication
- **POST** `/api/auth/login` - Login and get JWT token (No auth required)

#### Driver Management (Quản Lý Tài Xế)
- **GET** `/api/driver` - Get all drivers
- **GET** `/api/driver/:id` - Get driver by ID
- **POST** `/api/driver` - Create new driver
- **PUT** `/api/driver/:id` - Update driver
- **DELETE** `/api/driver/:id` - Delete driver

#### Orders (Đơn Hàng)
- **GET** `/api/don-hang` - Get all orders (with filter, sort, pagination)
- **GET** `/api/don-hang/:id` - Get order by ID
- **POST** `/api/don-hang` - Create new order
- **PUT** `/api/don-hang/:id` - Update order
- **DELETE** `/api/don-hang/:id` - Delete order

#### Reports (Báo Cáo)
- **GET** `/api/bao-cao/top-tai-xe` - Top drivers by rating
- **GET** `/api/bao-cao/top-khach-hang` - Top customers by revenue

## 🔐 Authentication
All endpoints (except login) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎯 Features
- ✅ JWT authentication
- ✅ Driver Management (Full CRUD)
- ✅ Order Management (Full CRUD)
- ✅ Advanced filtering, sorting, and pagination
- ✅ SQL Functions for reports
- ✅ Foreign key constraint checking
- ✅ Input validation & error handling
- ✅ Unicode support (Vietnamese)

## 📊 Test Results
- **Total Tests:** 29
- **Passed:** 29 ✅
- **Failed:** 0
- **Success Rate:** 100% 🎉
- **Test Date:** November 15-16, 2025

### Test Documentation
- 📋 **TEST_CASE.md** - Detailed test results with pass/fail status
- 📮 **TEST_GUIDE_POSTMAN.md** - Postman testing guide (29 test cases)
- 📚 **TEST_GUIDE_SWAGGER.md** - Interactive Swagger UI testing guide

### Testing Options
You can test the API using **3 methods**:
1. **Swagger UI** (Recommended for quick testing)
   - Access: http://localhost:3000/api-docs
   - Interactive browser-based testing
   - No installation required
   
2. **Postman** (Recommended for comprehensive testing)
   - Import collection from `TEST_GUIDE_POSTMAN.md`
   - Automated test scripts
   - Environment variable management
   
3. **Manual HTTP requests**
   - cURL, REST Client, or any HTTP tool
   - Copy requests from Swagger UI or Postman guide


## 🧪 Testing
See `TEST_CASE.md` for comprehensive test cases and results.
