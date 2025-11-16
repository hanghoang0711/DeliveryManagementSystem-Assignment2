# 📦 Delivery Management System
> **Hệ Thống Quản Lí Dịch Vụ Vận Chuyển Và Giao Hàng Theo Yêu Cầu**  

---

## 📋 Tổng Quan Hệ Thống

**Delivery Management System** là một hệ thống quản lý giao hàng toàn diện, bao gồm:
- 🗄️ **Database Schema** với MS SQL Server
- 🔌 **RESTful API Backend** với Node.js và Express
- 📚 **Interactive API Documentation** với Swagger UI
- 🧪 **Comprehensive Testing** với Postman và Swagger

---

## 🏗️ Kiến Trúc Hệ Thống

```
DeliveryManagementSystem-Assignment2/
├── BTL2_Part1_v2.sql           # Database schema chính thức
├── backend/                     # RESTful API Server
│   ├── config/                  # Cấu hình database & Swagger
│   ├── controllers/             # API logic handlers
│   ├── middleware/              # Auth & validation
│   ├── models/                  # Sequelize ORM models
│   ├── routes/                  # API endpoints
│   ├── server.js                # Entry point
│   ├── seed.js                  # Database seeding
│   ├── TEST_GUIDE.md            # Hướng dẫn test Powershell
│   ├── TEST_GUIDE_POSTMAN.md    # Hướng dẫn test Postman
│   ├── TEST_GUIDE_SWAGGER.md    # Hướng dẫn test Swagger UI
│   ├── TEST_CASE.md             # Kết quả test 29 test cases
│   └── README.md                # Backend documentation
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### Thông Tin Cơ Sở Dữ Liệu
- **Database:** `QuanLyGiaoHang_Nhom06`
- **DBMS:** Microsoft SQL Server 2022
- **Schema File:** `BTL2_Part1_v2.sql`
- **Authentication:** SQL Server Authentication
- **Login:** `sManager` / `Nhom6251`

### Các Nhóm Bảng Chính

#### 1. Quản Lý Nhân Viên (8 bảng)
- `NHANVIEN` - Thông tin nhân viên
- `QUAN_TRI_VIEN` - Quản trị viên
- `NHAN_VIEN_QUAN_LY_TAI_XE` - Nhân viên quản lý tài xế
- `NHANVIEN_XU_LI_DON_HANG` - Nhân viên xử lý đơn hàng
- `NHANVIEN_HO_TRO` - Nhân viên hỗ trợ khách hàng
- `NHANVIEN_TAI_CHINH` - Nhân viên tài chính
- `CA_LAM_VIEC_CUA_NHAN_VIEN` - Ca làm việc (đa trị)
- `NHAN_VIEN_DUOC_GIAM_SAT` - Quan hệ giám sát

#### 2. Quản Lý Tài Xế (8 bảng)
- `TAI_XE` - Thông tin tài xế (Rating, CCCD, trạng thái)
- `TAI_XE_XE_MAY` - Tài xế xe máy
- `TAI_XE_XE_TAI` - Tài xế xe tải
- `TAI_XE_SDT` - Số điện thoại tài xế (đa trị)
- `GHI_CHU_QUAN_LY_TAI_XE` - Ghi chú quản lý
- `MENTORSHIP` - Quan hệ mentor/mentee
- `SU_DUNG_XE_MAY` - Tài xế sử dụng xe máy
- `SU_DUNG_XE_TAI` - Tài xế sử dụng xe tải

#### 3. Quản Lý Khách Hàng (6 bảng)
- `KHACH_HANG` - Thông tin khách hàng
- `KHACH_HANG_CA_NHAN` - Khách hàng cá nhân
- `KHACH_HANG_DOANH_NGHIEP` - Khách hàng doanh nghiệp
- `HANG_THANH_VIEN` - Hạng thành viên (Đồng, Bạc, Vàng, Kim Cương)
- `SO_DIEN_THOAI_CUA_KHACH_HANG` - SDT khách hàng (đa trị)
- `DIA_CHI_CUA_KHACH_HANG` - Địa chỉ khách hàng (đa trị)

#### 4. Quản Lý Đơn Hàng (8 bảng)
- `DON_HANG` - Đơn hàng chính
- `HOA_DON` - Hóa đơn thanh toán
- `DON_HANG_DUOC_TIEP_NHAN` - Nhân viên tiếp nhận
- `DON_HANG_DUOC_GIAO` - Chi tiết giao hàng
- `DON_HANG_HUY` - Đơn hàng hủy
- `DON_HANG_HOAN_VE_KHO` - Đơn hàng hoàn về kho
- `THONG_TIN_XU_LI_DON_HANG` - Lịch sử trạng thái
- `DANH_GIA_CUA_KHACH_HANG` - Đánh giá của khách hàng

#### 5. Quản Lý Khuyến Mãi (4 bảng)
- `CHUONG_TRINH_KHUYEN_MAI` - Chương trình khuyến mãi
- `MA_KHUYEN_MAI` - Mã khuyến mãi (thực thể yếu)
- `MA_GIAM_GIA` - Mã giảm giá
- `MA_GIAM_GIA_THEO_HANG` - Mã giảm giá theo hạng thành viên

#### 6. Quản Lý Giao Hàng (5 bảng)
- `CHUYEN_GIAO_HANG` - Chuyến giao hàng
- `XE` - Phương tiện (xe máy/xe tải)
- `KHO` - Kho hàng
- `KHOANG_CACH_VAN_CHUYEN` - Khoảng cách vận chuyển
- `YEU_CAU_HO_TRO` - Yêu cầu hỗ trợ

#### 7. Quản Lý Thanh Toán (2 bảng)
- `THANH_TOAN` - Giao dịch thanh toán
- `GIAO_DICH_DUOC_KIEM_SOAT` - Kiểm soát giao dịch

### Database Objects

#### Functions (2)
- `fn_TopTaiXeDonGian` - Top tài xế theo rating và số chuyến giao
- `fn_TopKhachHangTheoDoanhThu` - Top khách hàng theo doanh thu

#### Stored Procedures (2)
- `sp_TaoDonHang` - Tạo đơn hàng mới với validation
- `sp_HuyDonHang` - Hủy đơn hàng với kiểm tra trạng thái

---

## 🔌 Backend API

### Công Nghệ
- **Runtime:** Node.js v22.20.0
- **Framework:** Express.js v5.1.0
- **ORM:** Sequelize v6.37.7
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **API Documentation:** Swagger UI Express + Swagger JSDoc
- **API Standard:** OpenAPI 3.0

### Tính Năng API

#### 🔐 Authentication
- JWT-based authentication
- Bcrypt password hashing
- Token expiration: 1 hour
- Middleware protection cho protected routes

#### 📊 API Endpoints (14 endpoints)

**Authentication (1)**
- POST `/api/auth/login` - Đăng nhập và nhận JWT token

**Driver Management (5)**
- GET `/api/driver` - Lấy danh sách tài xế
- GET `/api/driver/:id` - Lấy tài xế theo ID
- POST `/api/driver` - Tạo tài xế mới
- PUT `/api/driver/:id` - Cập nhật tài xế
- DELETE `/api/driver/:id` - Xóa tài xế

**Order Management (5)**
- GET `/api/don-hang` - Lấy danh sách đơn hàng (filter, sort, pagination)
- GET `/api/don-hang/:id` - Lấy đơn hàng theo ID
- POST `/api/don-hang` - Tạo đơn hàng mới
- PUT `/api/don-hang/:id` - Cập nhật đơn hàng
- DELETE `/api/don-hang/:id` - Xóa đơn hàng

**Reports (2)**
- GET `/api/bao-cao/top-tai-xe` - Top tài xế theo rating
- GET `/api/bao-cao/top-khach-hang` - Top khách hàng theo doanh thu

#### 🎯 Advanced Features
- **Filtering:** Lọc theo trạng thái, khách hàng
- **Sorting:** Sắp xếp ASC/DESC theo bất kỳ field nào
- **Pagination:** page, limit với metadata đầy đủ
- **Foreign Key Validation:** Kiểm tra 4 bảng liên quan trước khi DELETE
- **Unicode Support:** Hỗ trợ đầy đủ tiếng Việt (LIKE pattern matching)
- **Error Handling:** Comprehensive error messages
- **Input Validation:** Request body validation

---

## 📚 API Documentation

### 🌐 Swagger UI (Interactive)
Truy cập: **http://localhost:3000/api-docs**

**Tính năng:**
- 🔍 Browse 14 endpoints với schemas chi tiết
- 🧪 Test trực tiếp trên browser với "Try it out"
- 🔐 Built-in JWT authentication
- 📖 Auto-generated từ code (luôn up-to-date)
- 💾 Download responses, copy cURL commands
- 🎨 UI sạch đẹp, organized theo tags

**Cách sử dụng:**
1. Start server: `cd backend; node server.js`
2. Mở browser: http://localhost:3000/api-docs
3. Login qua POST /api/auth/login → Copy token
4. Click "Authorize" 🔓 → Paste token
5. Test bất kỳ endpoint nào

Xem hướng dẫn chi tiết: `backend/TEST_GUIDE_SWAGGER.md`

### 📮 Postman Collection
Import collection từ: `backend/TEST_GUIDE_POSTMAN.md`

**Bao gồm:**
- ✅ 29 test cases đầy đủ
- ✅ Environment variables pre-configured
- ✅ Auto-save token after login
- ✅ Test scripts cho validation
- ✅ Full request/response examples

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống
- **Node.js:** v22.20.0 or higher
- **MS SQL Server:** 2022 (Express hoặc Developer Edition)
- **Git:** For cloning repository
- **Postman:** (Optional) For API testing
- **Web Browser:** For Swagger UI

### Bước 1: Cài Đặt Database

```sql
-- 1. Kết nối SQL Server (Windows Authentication hoặc SA)
-- 2. Mở SQL Server Management Studio (SSMS)
-- 3. Chạy file BTL2_Part1_v2.sql
-- File sẽ tự động:
--   - Tạo database QuanLyGiaoHang_Nhom06
--   - Tạo bảng với constraints
--   - Insert dữ liệu mẫu
--   - Tạo 2 functions và 2 stored procedures
```

### Bước 2: Cài Đặt Backend

```powershell
# Clone repository (nếu chưa có)
git clone <repository-url>
cd PART3/backend

# Cài đặt dependencies
npm install
# Sẽ cài: express, sequelize, tedious, bcrypt, jwt, 
#         swagger-ui-express, swagger-jsdoc, và 200+ packages khác

# Seed database (chỉ chạy 1 lần)
node seed.js
# Tạo:
#   - SQL Server login: sManager/Nhom6251
#   - Admin user: admin/admin123
#   - Employee: NV001

# Khởi động server
node server.js
```

**Output khi khởi động thành công:**
```
✅ Database đã kết nối thành công!
🚀 Server chạy trên port 3000
📍 Auth: http://localhost:3000/api/auth/login
📍 Driver: http://localhost:3000/api/driver
📍 Orders: http://localhost:3000/api/don-hang
📍 Reports: http://localhost:3000/api/bao-cao
📚 API Docs: http://localhost:3000/api-docs
✅ Kết nối database thành công!
```

### Bước 3: Test API

#### Option 1: Swagger UI (Nhanh nhất)
```
1. Mở browser: http://localhost:3000/api-docs
2. Click endpoint "POST /api/auth/login" → "Try it out"
3. Request body: {"username": "admin", "password": "admin123"}
4. Execute → Copy token
5. Click "Authorize" (góc trên) → Paste token → Authorize
6. Test các endpoints khác
```

#### Option 2: Postman
```
1. Mở Postman
2. Import collection từ backend/TEST_GUIDE_POSTMAN.md
3. Setup environment: base_url = http://localhost:3000
4. Run collection (29 tests)
```

#### Option 3: cURL
```powershell
# Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Get drivers (with token)
curl http://localhost:3000/api/driver `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 Testing

### Test Coverage
- **Total Test Cases:** 29
- **Categories:**
  - Authentication: 3 tests
  - Driver Management: 6 tests
  - Order Management: 16 tests
  - Reports: 4 tests
- **Success Rate:** 100% ✅ (29/29 passed)
- **Test Date:** November 15-16, 2025

### Test Documentation Files
1. **TEST_CASE.md** - Chi tiết 29 test cases với kết quả
2. **TEST_GUIDE_POSTMAN.md** - Hướng dẫn test bằng Postman
3. **TEST_GUIDE_SWAGGER.md** - Hướng dẫn test bằng Swagger UI

### Test Scenarios

#### Authentication Tests
- ✅ Login thành công với admin account
- ✅ Login thất bại - sai username
- ✅ Login thất bại - sai password

#### Driver Management Tests
- ✅ Tạo tài xế mới với đầy đủ thông tin
- ✅ Tạo tài xế thất bại - thiếu trường bắt buộc
- ✅ Lấy danh sách tất cả tài xế
- ✅ Lấy tài xế theo ID
- ✅ Cập nhật thông tin tài xế
- ✅ Xóa tài xế

#### Order Management Tests (16 tests)
- ✅ Pagination với page và limit
- ✅ Filter theo trạng thái đơn hàng
- ✅ Filter theo mã khách hàng
- ✅ Filter kết hợp nhiều điều kiện
- ✅ Sort tăng dần/giảm dần
- ✅ Lấy đơn hàng theo ID
- ✅ Tạo đơn hàng mới
- ✅ Validation (khách hàng không tồn tại, thiếu trường)
- ✅ Cập nhật đơn hàng
- ✅ Xóa đơn hàng

#### Report Tests
- ✅ Top tài xế với tham số mặc định
- ✅ Top tài xế với custom parameters
- ✅ Top khách hàng với tham số mặc định
- ✅ Top khách hàng theo khoảng thời gian

---

## 📊 Database Statistics

### Dữ Liệu Mẫu
- **Nhân viên:** 6 người (Admin, Quản lý tài xế, Xử lý đơn, Hỗ trợ, Tài chính)
- **Tài xế:** 10 người (6 xe máy, 3 xe tải, 1 cả hai)
- **Khách hàng:** 9 người (6 cá nhân, 3 doanh nghiệp)
- **Hạng thành viên:** 4 hạng (Đồng, Bạc, Vàng, Kim Cương)
- **Đơn hàng:** 10 đơn (5 đã giao, 2 đang giao, 2 đang xử lý, 1 đã hủy)
- **Xe:** 10 xe (6 xe máy, 4 xe tải)
- **Chuyến giao hàng:** 5 chuyến
- **Khuyến mãi:** 4 chương trình, 5 mã khuyến mãi
- **Mã giảm giá:** 6 mã

### Relationships
- **1-1:** 3 relationships (GIAO_DICH_DUOC_KIEM_SOAT, HOA_DON, ...)
- **1-N:** 25+ relationships
- **M-N:** 8 relationships (DON_HANG_DUOC_TIEP_NHAN, SU_DUNG_XE_MAY, ...)
- **ISA (Specialization):** 6 hierarchies
  - NHANVIEN → 5 loại nhân viên
  - KHACH_HANG → 2 loại khách hàng
  - TAI_XE → 2 loại tài xế
  - XE → 2 loại xe

---


## 🛠️ Troubleshooting

### Database Connection Issues
```sql
-- Kiểm tra SQL Server đang chạy
-- Services → SQL Server (MSSQLSERVER) → Running

-- Kiểm tra login tồn tại
SELECT name FROM sys.sql_logins WHERE name = 'sManager';

-- Tạo lại login nếu cần
CREATE LOGIN sManager WITH PASSWORD = 'Nhom6251';
USE QuanLyGiaoHang_Nhom06;
CREATE USER sManager FOR LOGIN sManager;
EXEC sp_addrolemember 'db_owner', 'sManager';
```

### Backend Issues
```powershell
# Lỗi: Cannot find module
npm install

# Lỗi: Port 3000 already in use
# Đổi port trong server.js hoặc kill process:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Lỗi: Database connection failed
# Kiểm tra config/db.config.js
# Kiểm tra SQL Server đang chạy
# Kiểm tra firewall cho port 1433
```

### Swagger UI Issues
```powershell
# Swagger UI không load
# 1. Restart server
node server.js

# 2. Clear browser cache (Ctrl+Shift+R)

# 3. Kiểm tra console errors (F12)

# 4. Verify swagger packages installed
npm list swagger-ui-express swagger-jsdoc
```

### Testing Issues
```powershell
# Test thất bại - 401 Unauthorized
# → Chưa authorize hoặc token hết hạn
# → Login lại để lấy token mới

# Test thất bại - 404 Not Found
# → Kiểm tra URL endpoint
# → Kiểm tra ID có tồn tại trong database

# Postman không save token
# → Kiểm tra Test script trong login request
# → Verify environment variable "token" được set
```

---



## 📚 Tài Liệu Tham Khảo

### Database
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/)
- [Database Design Best Practices](https://www.sqlshack.com/sql-database-design-best-practices/)

### Backend
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [JWT Introduction](https://jwt.io/introduction)

### API Documentation
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger JSDoc Guide](https://github.com/Surnet/swagger-jsdoc)

### Testing
- [Postman Learning Center](https://learning.postman.com/)
- [API Testing Best Practices](https://testfully.io/blog/api-testing-best-practices/)

---


## 📄 License

This project is created for educational purposes as part of Database course assignment.

---


**📅 Last Updated:** November 16, 2025  
**🔖 Version:** 1.0.0  
**👨‍💻 Maintained by:** Nhóm 06 - HK251