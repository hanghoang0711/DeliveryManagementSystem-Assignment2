# Backend API - Delivery Management System

## 📋 Description
RESTful API backend cho Delivery Management System với Node.js, Express, và Sequelize ORM. Tính năng mới: Quản lý chuyến giao hàng, tự động tính phí vận chuyển, 11 trạng thái đơn hàng. API documentation với Swagger UI.

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
├── config/                      # Database & Swagger configuration
├── controllers/                 # Request handlers
│   ├── donHangController.js     # Orders
│   ├── chuyenGiaoHangController.js  # Delivery trips (NEW)
│   ├── driver.controller.js     # Driver management
│   ├── baoCaoController.js      # Reports
│   └── auth.controller.js       # Authentication
├── middleware/                  # Authentication & validation
├── models/                      # Sequelize models
│   ├── DonHang.js               # 11 statuses, 4 shipping fields
│   ├── ChuyenGiaoHang.js        # Delivery trips (NEW)
│   ├── DonHangDuocGiao.js       # Junction table (NEW)
│   └── ...                      # Other models
├── routes/                      # API routes (20 endpoints)
├── server.js                    # Entry point
├── seed.js                      # Database seeding
├── TEST_GUIDE_SWAGGER_V2.md     # 26 test cases 
└── TEST_RESULT_SUMMARY.md       # Test results
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


## 📚 API Documentation

### 🌐 Interactive Documentation - Swagger UI 
Access interactive API documentation at: **http://localhost:3000/api-docs**

**Features:**
- 🔍 Browse 20 API endpoints  với schemas chi tiết
- 🧪 Test APIs directly với "Try it out" button
- 🔐 Built-in JWT authentication
- 📖 Auto-generated from code (always up-to-date)
- 💾 Download responses và copy cURL commands
- 🚚 Test Delivery Trip Management (NEW)
- 💰 Test Auto Shipping Calculation (NEW)
- 🎨 Clean UI với organized groups

**Quick Start:**
1. Start server: `node server.js`
2. Open browser: http://localhost:3000/api-docs
3. Login via POST /api/auth/login → Copy token
4. Click "Authorize" 🔓 → Paste token → Authorize
5. Test any endpoint with "Try it out"

See `TEST_GUIDE_SWAGGER_V2.md` for 26 test cases .

---

### 🔌 API Endpoints (20 endpoints - )

#### Authentication
- **POST** `/api/auth/login` - Login and get JWT token

#### Driver Management
- **GET** `/api/driver` - Get all drivers
- **GET** `/api/driver/:id` - Get driver by ID
- **POST** `/api/driver` - Create new driver
- **PUT** `/api/driver/:id` - Update driver
- **DELETE** `/api/driver/:id` - Delete driver

#### Orders 
- **GET** `/api/don-hang` - Get orders 
- **GET** `/api/don-hang/:id` - Get order by ID
- **POST** `/api/don-hang` - Create order (auto calculate 4 shipping fields)
- **PUT** `/api/don-hang/:id` - Update order (validate 11 statuses)
- **DELETE** `/api/don-hang/:id` - Delete order

#### Delivery Trips (NEW - )
- **GET** `/api/chuyen-giao-hang` - Get all delivery trips
- **GET** `/api/chuyen-giao-hang/:id` - Get delivery trip by ID
- **GET** `/api/chuyen-giao-hang/:id/total-distance` - Calculate total distance
- **POST** `/api/chuyen-giao-hang` - Create delivery trip
- **POST** `/api/chuyen-giao-hang/:id/add-don-hang` - Add order to trip
- **PUT** `/api/chuyen-giao-hang/:id` - Update trip status

#### Reports
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
- ✅ Order Management (Full CRUD) - 11 statuses, auto shipping calculation
- ✅ **Delivery Trip Management (NEW)** - Gộp nhiều đơn vào 1 chuyến
- ✅ **Auto Shipping Calculation** - 4 fields: phi_van_chuyen_goc, so_tien_duoc_giam, phi_van_chuyen_sau_giam, quang_duong
- ✅ **11 Order Statuses** - From Đang xử lý to Đã hoàn thành
- ✅ Advanced filtering (11 statuses), sorting (quang_duong), pagination
- ✅ SQL Functions for reports
- ✅ Foreign key validation (DON_HANG_DUOC_GIAO)
- ✅ Input validation & error handling
- ✅ Unicode support (Vietnamese)

## 📊 Test Results 
- **Total Tests:** 26
- **Passed:** 26 ✅
- **Failed:** 0
- **Success Rate:** 100% 🎉
- **Test Date:** November 22, 2025

### Test Documentation 
- 📚 **TEST_GUIDE_SWAGGER_V2.md** - 26 test cases for 
  * Authentication: 3 tests
  * Driver Management: 6 tests
  * Order Management: 6 tests (11 statuses, auto calculation)
  * Delivery Trips: 6 tests (NEW)
  * Reports: 5 tests

