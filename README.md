# 📦 Delivery Management System
> **Hệ Thống Quản Lí Dịch Vụ Vận Chuyển Và Giao Hàng Theo Yêu Cầu**  

---

## 📋 Tổng Quan Hệ Thống

**Delivery Management System** là hệ thống quản lý giao hàng với các tính năng:
- 🗄️ **Database Schema** với MS SQL Server
- 🔌 **RESTful API Backend** với Node.js và Express
- 📚 **Interactive API Documentation** với Swagger UI
- 🧪 **Comprehensive Testing** với 26 test cases
- 🚚 **Delivery Trip Management** - Quản lý chuyến giao hàng và gộp đơn
- 💰 **Auto Shipping Calculation** - Tự động tính phí vận chuyển
- 📊 **11 Order Statuses** - Quản lý chi tiết trạng thái đơn hàng

---


## 🗄️ Database Schema

### Thông Tin Cơ Sở Dữ Liệu
- **Database:** `QuanLyGiaoHang_Nhom06`
- **DBMS:** Microsoft SQL Server 2022
- **Schema File:** `sql/BTL2_QuanLyGiaoHang_Nhom06_v2.sql`
- **Authentication:** SQL Server Authentication
- **Login:** `sManager` / `Nhom6251`
- **Version:**  - Tích hợp thanh toán vào đơn hàng, quản lý chuyến giao

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

#### 4. Quản Lý Đơn Hàng ( - 2 bảng)
- `DON_HANG` - Đơn hàng với 11 trạng thái, tự động tính phí vận chuyển
  * **4 Trường Phí Vận Chuyển:** phi_van_chuyen_goc, so_tien_duoc_giam, phi_van_chuyen_sau_giam, quang_duong
  * **11 Trạng Thái:** Đang xử lý, Đang tìm tài xế, Đã tìm được tài xế, Đang lấy hàng, Lấy hàng thành công, Lấy hàng thất bại, Đang giao hàng, Giao hàng thành công, Giao hàng thất bại, Đã hoàn về kho, Đã hoàn thành
  * **Tích Hợp Thanh Toán:** Thông tin thanh toán được lưu trực tiếp trong DON_HANG (không còn bảng HOA_DON)
- `DON_HANG_DUOC_GIAO` - Junction table cho relationship giữa DON_HANG và CHUYEN_GIAO_HANG

#### 5. Quản Lý Khuyến Mãi (4 bảng)
- `CHUONG_TRINH_KHUYEN_MAI` - Chương trình khuyến mãi
- `MA_KHUYEN_MAI` - Mã khuyến mãi (thực thể yếu)
- `MA_GIAM_GIA` - Mã giảm giá
- `MA_GIAM_GIA_THEO_HANG` - Mã giảm giá theo hạng thành viên

#### 6. Quản Lý Giao Hàng
- `CHUYEN_GIAO_HANG` - Chuyến giao hàng (Tính năng mới )
  * **Gộp Đơn:** Một chuyến có thể giao nhiều đơn hàng
  * **Tự Động Tính Khoảng Cách:** Tổng khoảng cách từ các đơn hàng trong chuyến
  * **3 Trạng Thái:** Đang thực hiện, Hoàn thành, Đã hủy
  * **Thứ Tự Giao:** Thu_tu_lay_hang và Thu_tu_giao_hang cho tối ưu route
- `XE` - Phương tiện (xe máy/xe tải)
- `KHO` - Kho hàng

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

#### Triggers (2)
- `trg_capNhatTrangThaiDonHang` - Cập nhật trạng thái đơn hàng (Trang_thai_don) trong bảng DON_HANG bằng trạng thái mới nhất (Tinh_trang) được chèn vào bảng lịch sử THONG_TIN_XU_LI_DON_HANG.
- `trg_capNhatDiemThanhVienKhiDonHangThanhCong` - Cập nhật điểm (Diem_thanh_vien) và hạng (Ten_hang) của khách hàng trong bảng KHACH_HANG khi một đơn hàng chuyển sang trạng thái "Đã hoàn thành" (dựa trên việc INSERT vào THONG_TIN_XU_LI_DON_HANG).
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

#### 📊 API Endpoints (20 endpoints - )

**Authentication (1)**
- POST `/api/auth/login` - Đăng nhập và nhận JWT token

**Driver Management (5)**
- GET `/api/driver` - Lấy danh sách tài xế
- GET `/api/driver/:id` - Lấy tài xế theo ID
- POST `/api/driver` - Tạo tài xế mới
- PUT `/api/driver/:id` - Cập nhật tài xế
- DELETE `/api/driver/:id` - Xóa tài xế

**Order Management (5) - **
- GET `/api/don-hang` - Lấy danh sách đơn hàng (filter by 11 statuses, sort, pagination)
- GET `/api/don-hang/:id` - Lấy đơn hàng theo ID
- POST `/api/don-hang` - Tạo đơn hàng mới (tự động tính 4 trường phí vận chuyển)
- PUT `/api/don-hang/:id` - Cập nhật đơn hàng (validate 11 trạng thái)
- DELETE `/api/don-hang/:id` - Xóa đơn hàng (kiểm tra DON_HANG_DUOC_GIAO)

**Delivery Trip Management (6) - TÍNH NĂNG MỚI **
- GET `/api/chuyen-giao-hang` - Lấy danh sách chuyến giao hàng
- GET `/api/chuyen-giao-hang/:id` - Lấy chi tiết chuyến giao hàng
- GET `/api/chuyen-giao-hang/:id/total-distance` - Tính tổng khoảng cách chuyến
- POST `/api/chuyen-giao-hang` - Tạo chuyến giao hàng mới
- POST `/api/chuyen-giao-hang/:id/add-don-hang` - Gộp đơn vào chuyến
- PUT `/api/chuyen-giao-hang/:id` - Cập nhật trạng thái chuyến

**Reports (2)**
- GET `/api/bao-cao/top-tai-xe` - Top tài xế theo rating
- GET `/api/bao-cao/top-khach-hang` - Top khách hàng theo doanh thu

#### 🎯 Advanced Features
- **Auto Shipping Calculation:** Tự động tính 4 trường phí vận chuyển (phi_van_chuyen_goc, so_tien_duoc_giam, phi_van_chuyen_sau_giam, quang_duong)
- **11 Order Statuses:** Validate enum với 11 trạng thái từ Đang xử lý → Đã hoàn thành
- **Delivery Trip Management:** Gộp nhiều đơn vào 1 chuyến, tự động tính tổng khoảng cách
- **Auto-Increment:** Ma_don_hang format DHxxxx, DeliveryID format CGHxxx
- **Filtering:** Lọc theo 11 trạng thái, khách hàng, quang_duong
- **Sorting:** Sắp xếp theo quang_duong, phi_van_chuyen_sau_giam, v.v.
- **Pagination:** page, limit với metadata đầy đủ
- **Foreign Key Validation:** Kiểm tra DON_HANG_DUOC_GIAO trước khi DELETE
- **Unicode Support:** Hỗ trợ đầy đủ tiếng Việt
- **Error Handling:** Comprehensive error messages

---

## 📚 API Documentation

### 🌐 Swagger UI (Interactive) - 
Truy cập: **http://localhost:3000/api-docs**

**Tính năng:**
- 🔍 Browse 20 endpoints  với schemas chi tiết
- 🧪 Test trực tiếp trên browser với "Try it out"
- 🔐 Built-in JWT authentication
- 📖 Auto-generated từ code (luôn up-to-date)
- 💾 Download responses, copy cURL commands
- 🚚 Test Delivery Trip Management (tính năng mới)
- 💰 Test Auto Shipping Calculation
- 🎨 UI sạch đẹp, organized theo tags

**Cách sử dụng:**
1. Start server: `cd backend; node server.js`
2. Mở browser: http://localhost:3000/api-docs
3. Login qua POST /api/auth/login → Copy token
4. Click "Authorize" 🔓 → Paste token
5. Test bất kỳ endpoint nào

Xem hướng dẫn chi tiết: `backend/TEST_GUIDE_SWAGGER_V2.md` (26 test cases cho )

**Bao gồm:**
- ✅ 26 test cases cho 
- ✅ Test Delivery Trip Management (6 tests)
- ✅ Test Auto Shipping Calculation
- ✅ Test 11 Order Statuses
- ✅ Environment variables pre-configured
- ✅ Auto-save token after login

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
-- 3. Chạy file BTL2_QuanLyGiaoHang_Nhom06_v2.sql
-- File sẽ tự động:
--   - Tạo database QuanLyGiaoHang_Nhom06
--   - Tạo bảng với constraints
--   - Insert dữ liệu mẫu
--   - Tạo 2 functions và 2 stored procedures
--   - Tạo 2 trigger
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

#### Swagger UI
```
1. Mở browser: http://localhost:3000/api-docs
2. Click endpoint "POST /api/auth/login" → "Try it out"
3. Request body: {"username": "admin", "password": "admin123"}
4. Execute → Copy token
5. Click "Authorize" (góc trên) → Paste token → Authorize
6. Test các endpoints khác
```


---

## 🧪 Testing

### Test Coverage
- **Total Test Cases:** 26
- **Categories:**
  - Authentication: 3 tests
  - Driver Management: 6 tests
  - Order Management: 6 tests ( - test 11 statuses, auto calculation)
  - Delivery Trip Management: 6 tests (TÍNH NĂNG MỚI)
  - Reports: 5 tests
- **Success Rate:** 100% ✅ (26/26 passed)
- **Test Date:** November 22, 2025
- **Test Documentation:** `backend/TEST_GUIDE_SWAGGER_V2.md`


### Test Scenarios

#### Authentication Tests
- ✅ Login thành công với sManager account
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


**📅 Last Updated:** November 22, 2025  
**👨‍💻 Maintained by:** Nhóm 06 - HK251
