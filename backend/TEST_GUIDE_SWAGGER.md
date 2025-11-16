# 📚 HƯỚNG DẪN TEST API BẰNG SWAGGER UI

## 📋 Mục lục
1. [Giới thiệu Swagger UI](#1-giới-thiệu-swagger-ui)
2. [Truy cập Swagger UI](#2-truy-cập-swagger-ui)
3. [Giao diện Swagger UI](#3-giao-diện-swagger-ui)
4. [Quy trình xác thực (Authentication)](#4-quy-trình-xác-thực-authentication)
5. [Hướng dẫn test 29 testcases](#5-hướng-dẫn-test-29-testcases)
6. [Tips & Tricks](#6-tips--tricks)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Giới thiệu Swagger UI

### Swagger UI là gì?
Swagger UI là một công cụ mã nguồn mở cho phép:
- **Visualize** (trực quan hóa) tất cả các API endpoints
- **Test** (kiểm tra) API trực tiếp trên trình duyệt
- **Explore** (khám phá) request/response schemas
- **Authenticate** (xác thực) với JWT token

### Ưu điểm so với Postman
✅ Không cần cài đặt thêm phần mềm  
✅ Tích hợp sẵn trong project  
✅ Tự động generate từ code  
✅ Luôn đồng bộ với API  
✅ Dễ dàng share với team  

---

## 2. Truy cập Swagger UI

### Bước 1: Khởi động server
```powershell
cd D:\HK251\Database\BTL2\PART3\backend
node server.js
```

### Bước 2: Mở Swagger UI
Truy cập URL: **http://localhost:3000/api-docs**

Bạn sẽ thấy màn hình:
```
┌─────────────────────────────────────────┐
│   Delivery Management System API       │
│   Version 1.0.0                         │
│                                         │
│   [Authorize] 🔓                        │
├─────────────────────────────────────────┤
│   ▼ Authentication                      │
│   ▼ Driver Management                   │
│   ▼ Order Management                    │
│   ▼ Reports                             │
└─────────────────────────────────────────┘
```

---

## 3. Giao diện Swagger UI

### 3.1 Các thành phần chính

#### **Header Section**
- **Title:** Delivery Management System API
- **Version:** 1.0.0
- **Description:** RESTful API for Delivery Management System
- **Authorize Button:** 🔓 (Click để nhập JWT token)

#### **Tag Groups** (Nhóm endpoints)
- **Authentication** (1 endpoint): Đăng nhập
- **Driver Management** (5 endpoints): Quản lý tài xế
- **Order Management** (5 endpoints): Quản lý đơn hàng
- **Reports** (2 endpoints): Báo cáo thống kê

#### **Endpoint Card**
Mỗi endpoint hiển thị:
```
POST /api/auth/login    [Try it out]
  Login to get JWT token
  
  Parameters:
    - Body: (required)
      {
        "username": "string",
        "password": "string"
      }
  
  Responses:
    ✅ 200: Login successful
    ❌ 401: Invalid credentials
```

#### **Schemas Section** (Cuối trang)
Hiển thị các data models:
- `LoginRequest`
- `LoginResponse`
- `Driver`
- `Order`
- `Error`

### 3.2 HTTP Method Colors
- 🟢 **GET** (màu xanh lá): Lấy dữ liệu
- 🟡 **POST** (màu vàng): Tạo mới
- 🔵 **PUT** (màu xanh dương): Cập nhật
- 🔴 **DELETE** (màu đỏ): Xóa

---

## 4. Quy trình xác thực (Authentication)

### Bước 1: Đăng nhập để lấy token

#### 1.1. Mở endpoint login
- Click vào **▼ Authentication** để mở nhóm
- Click vào **POST /api/auth/login** để mở endpoint

#### 1.2. Click "Try it out"
Button ở góc phải sẽ chuyển từ "Try it out" → "Execute"

#### 1.3. Nhập thông tin đăng nhập
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### 1.4. Click "Execute"
Server sẽ trả về response:

**✅ Response 200 (Success):**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzMxNzU2MDAwLCJleHAiOjE3MzE3NTk2MDB9.xyz123abc456..."
}
```

#### 1.5. Copy JWT token
- Scroll xuống Response section
- Copy toàn bộ chuỗi token (bắt đầu bằng `eyJ...`)

### Bước 2: Authorize với token

#### 2.1. Click button "Authorize" 🔓 (góc trên bên phải)
Popup sẽ hiện ra:
```
┌─────────────────────────────────────┐
│  Available authorizations           │
├─────────────────────────────────────┤
│  bearerAuth (http, Bearer)          │
│                                     │
│  Value: [________________]          │
│         ↑ Paste token here          │
│                                     │
│  [Authorize]  [Close]               │
└─────────────────────────────────────┘
```

#### 2.2. Paste token
- **Lưu ý:** Chỉ paste **phần token**, KHÔNG cần thêm "Bearer " phía trước
- Ví dụ đúng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Ví dụ sai: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### 2.3. Click "Authorize"
Icon sẽ đổi từ 🔓 → 🔒 (đã xác thực)

### Bước 3: Test endpoint có authentication
Giờ tất cả các request sẽ tự động thêm header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Hướng dẫn test 29 testcases

### 📌 Nhóm 1: AUTHENTICATION (3 tests)

#### ✅ TC1: Đăng nhập thành công với tài khoản admin
**Endpoint:** `POST /api/auth/login`

**Bước thực hiện:**
1. Mở endpoint **POST /api/auth/login**
2. Click **"Try it out"**
3. Nhập request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- Token có định dạng JWT (3 phần phân cách bởi dấu chấm)

---

#### ✅ TC2: Đăng nhập thất bại - Sai username
**Endpoint:** `POST /api/auth/login`

**Bước thực hiện:**
1. Mở endpoint **POST /api/auth/login**
2. Click **"Try it out"**
3. Nhập request body:
```json
{
  "username": "wronguser",
  "password": "admin123"
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 401
- **Response Body:**
```json
{
  "message": "Tài khoản hoặc mật khẩu không đúng"
}
```

---

#### ✅ TC3: Đăng nhập thất bại - Sai password
**Endpoint:** `POST /api/auth/login`

**Bước thực hiện:**
1. Mở endpoint **POST /api/auth/login**
2. Click **"Try it out"**
3. Nhập request body:
```json
{
  "username": "admin",
  "password": "wrongpassword"
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 401
- **Response Body:**
```json
{
  "message": "Tài khoản hoặc mật khẩu không đúng"
}
```

---

### 📌 Nhóm 2: DRIVER MANAGEMENT (6 tests)

> **⚠️ Lưu ý:** Trước khi test nhóm này, phải **Authorize** với JWT token (xem mục 4)

#### ✅ TC4: Tạo tài xế mới thành công
**Endpoint:** `POST /api/driver`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token (icon 🔒)
2. Mở endpoint **POST /api/driver**
3. Click **"Try it out"**
4. Nhập request body:
```json
{
  "DriverID": "TX999",
  "Ho_ten": "Nguyễn Văn Test",
  "CCCD": "099999999999",
  "Gioi_Tinh": "Nam",
  "Ngay_Sinh": "1995-05-15",
  "SDT": "0999999999",
  "Email": "test@example.com",
  "Dia_chi": "123 Test Street",
  "Rating": 5.0,
  "Mo_ta": "Test driver from Swagger UI"
}
```
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 201
- **Response Body:**
```json
{
  "message": "Tài xế đã được thêm thành công",
  "data": {
    "DriverID": "TX999",
    "Ho_ten": "Nguyễn Văn Test",
    "CCCD": "099999999999",
    "Gioi_Tinh": "Nam",
    "Ngay_Sinh": "1995-05-15T00:00:00.000Z",
    "SDT": "0999999999",
    "Email": "test@example.com",
    "Dia_chi": "123 Test Street",
    "Rating": 5.0,
    "Mo_ta": "Test driver from Swagger UI"
  }
}
```

---

#### ✅ TC5: Tạo tài xế thất bại - Thiếu trường bắt buộc
**Endpoint:** `POST /api/driver`

**Bước thực hiện:**
1. Mở endpoint **POST /api/driver**
2. Click **"Try it out"**
3. Nhập request body (thiếu `Ho_ten`):
```json
{
  "DriverID": "TX888",
  "CCCD": "088888888888",
  "SDT": "0888888888"
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 400
- **Response Body:**
```json
{
  "message": "Validation error: Thiếu trường bắt buộc Ho_ten"
}
```

---

#### ✅ TC6: Lấy danh sách tất cả tài xế
**Endpoint:** `GET /api/driver`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/driver**
3. Click **"Try it out"**
4. Click **"Execute"** (không cần nhập gì)

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Mảng các tài xế
```json
[
  {
    "DriverID": "TX001",
    "Ho_ten": "Nguyễn Văn A",
    "CCCD": "001234567890",
    "Gioi_Tinh": "Nam",
    "Ngay_Sinh": "1990-01-01T00:00:00.000Z",
    "SDT": "0901234567",
    "Email": "tx001@example.com",
    "Dia_chi": "123 Nguyen Hue, HCMC",
    "Rating": 4.8,
    "Mo_ta": "Experienced driver"
  },
  {
    "DriverID": "TX999",
    "Ho_ten": "Nguyễn Văn Test",
    ...
  }
]
```

---

#### ✅ TC7: Lấy thông tin tài xế theo ID
**Endpoint:** `GET /api/driver/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/driver/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `TX999` (hoặc ID của tài xế vừa tạo ở TC4)
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "DriverID": "TX999",
  "Ho_ten": "Nguyễn Văn Test",
  "CCCD": "099999999999",
  "Gioi_Tinh": "Nam",
  "Ngay_Sinh": "1995-05-15T00:00:00.000Z",
  "SDT": "0999999999",
  "Email": "test@example.com",
  "Dia_chi": "123 Test Street",
  "Rating": 5.0,
  "Mo_ta": "Test driver from Swagger UI"
}
```

---

#### ✅ TC8: Cập nhật thông tin tài xế
**Endpoint:** `PUT /api/driver/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **PUT /api/driver/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `TX999`
5. Nhập **request body:**
```json
{
  "Ho_ten": "Nguyễn Văn Test Updated",
  "Rating": 4.5
}
```
6. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Cập nhật tài xế thành công",
  "data": {
    "DriverID": "TX999",
    "Ho_ten": "Nguyễn Văn Test Updated",
    "Rating": 4.5,
    ...
  }
}
```

---

#### ✅ TC9: Xóa tài xế
**Endpoint:** `DELETE /api/driver/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **DELETE /api/driver/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `TX999`
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Xóa tài xế thành công"
}
```

**Verify:**
- Thử GET /api/driver/TX999 → sẽ trả về 404

---

### 📌 Nhóm 3: ORDER MANAGEMENT (16 tests)

#### ✅ TC10: Lấy danh sách đơn hàng với pagination
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/don-hang**
3. Click **"Try it out"**
4. Nhập **query parameters:**
   - `page`: `1`
   - `limit`: `5`
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "data": [
    {
      "Ma_don_hang": 1,
      "Ma_khach_hang": "KH1",
      "Trang_thai_don": "Đã giao",
      "Tong_tien": 150000,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 5,
    "totalItems": 25,
    "totalPages": 5
  }
}
```

---

#### ✅ TC11: Lấy đơn hàng theo trạng thái
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `trang_thai_don`: `Đã giao`
   - `page`: `1`
   - `limit`: `10`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Chỉ chứa đơn hàng có `Trang_thai_don: "Đã giao"`

---

#### ✅ TC12: Lấy đơn hàng theo mã khách hàng
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `ma_khach_hang`: `KH1`
   - `page`: `1`
   - `limit`: `10`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Chỉ chứa đơn hàng của khách hàng KH1

---

#### ✅ TC13: Lấy đơn hàng với filter kết hợp
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `trang_thai_don`: `Đã giao`
   - `ma_khach_hang`: `KH1`
   - `page`: `1`
   - `limit`: `10`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Đơn hàng của KH1 có trạng thái "Đã giao"

---

#### ✅ TC14: Lấy đơn hàng với sắp xếp tăng dần
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `sortKey`: `Tong_tien`
   - `sortOrder`: `ASC`
   - `page`: `1`
   - `limit`: `5`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Đơn hàng được sắp xếp theo `Tong_tien` tăng dần

---

#### ✅ TC15: Lấy đơn hàng với sắp xếp giảm dần
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `sortKey`: `Tong_tien`
   - `sortOrder`: `DESC`
   - `page`: `1`
   - `limit`: `5`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Đơn hàng được sắp xếp theo `Tong_tien` giảm dần

---

#### ✅ TC16: Lấy trang cuối cùng
**Endpoint:** `GET /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `page`: `999` (trang không tồn tại)
   - `limit`: `5`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "data": [],
  "pagination": {
    "currentPage": 999,
    "pageSize": 5,
    "totalItems": 25,
    "totalPages": 5
  }
}
```

---

#### ✅ TC17: Lấy đơn hàng theo ID
**Endpoint:** `GET /api/don-hang/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/don-hang/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `1`
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "Ma_don_hang": 1,
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Nguyễn Văn A",
  "Trang_thai_don": "Đã giao",
  "Tong_tien": 150000,
  "thoi_gian_dat_don": "2024-11-01T10:30:00.000Z",
  ...
}
```

---

#### ✅ TC18: Lấy đơn hàng với ID không tồn tại
**Endpoint:** `GET /api/don-hang/{id}`

**Bước thực hiện:**
1. Mở endpoint **GET /api/don-hang/{id}**
2. Click **"Try it out"**
3. Nhập **path parameter:**
   - `id`: `99999`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 404
- **Response Body:**
```json
{
  "message": "Không tìm thấy đơn hàng"
}
```

---

#### ✅ TC19: Tạo đơn hàng mới thành công
**Endpoint:** `POST /api/don-hang`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **POST /api/don-hang**
3. Click **"Try it out"**
4. Nhập **request body:**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Nguyễn Văn A",
  "Trang_thai_don": "Chờ xử lý",
  "Tong_tien": 250000,
  "Phi_van_chuyen": 25000,
  "Phuong_thuc_thanh_toan": "COD",
  "Dia_chi_giao": "123 Test Street, HCMC",
  "Ghi_chu": "Test order from Swagger",
  "Loai_hang": "Thực phẩm"
}
```
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 201
- **Response Body:**
```json
{
  "message": "Đơn hàng đã được tạo thành công",
  "data": {
    "Ma_don_hang": 26,
    "Ma_khach_hang": "KH1",
    "SDT_nguoi_nhan": "0901234567",
    "ten_nguoi_nhan": "Nguyễn Văn A",
    "Trang_thai_don": "Chờ xử lý",
    "Tong_tien": 250000,
    ...
  }
}
```

**Lưu lại:** `Ma_don_hang: 26` (dùng cho các test sau)

---

#### ✅ TC20: Tạo đơn hàng thất bại - Khách hàng không tồn tại
**Endpoint:** `POST /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **POST /api/don-hang**
2. Click **"Try it out"**
3. Nhập **request body:**
```json
{
  "Ma_khach_hang": "KH999",
  "SDT_nguoi_nhan": "0909999999",
  "ten_nguoi_nhan": "Test User",
  "Trang_thai_don": "Chờ xử lý",
  "Tong_tien": 100000,
  "Phi_van_chuyen": 10000,
  "Phuong_thuc_thanh_toan": "COD",
  "Dia_chi_giao": "Test Address",
  "Loai_hang": "Thực phẩm"
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 404
- **Response Body:**
```json
{
  "message": "Khách hàng không tồn tại"
}
```

---

#### ✅ TC21: Tạo đơn hàng thất bại - Thiếu trường bắt buộc
**Endpoint:** `POST /api/don-hang`

**Bước thực hiện:**
1. Mở endpoint **POST /api/don-hang**
2. Click **"Try it out"**
3. Nhập **request body** (thiếu `SDT_nguoi_nhan`):
```json
{
  "Ma_khach_hang": "KH1",
  "ten_nguoi_nhan": "Test User",
  "Trang_thai_don": "Chờ xử lý",
  "Tong_tien": 100000
}
```
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 400
- **Response Body:**
```json
{
  "message": "Validation error: Thiếu trường bắt buộc SDT_nguoi_nhan"
}
```

---

#### ✅ TC22: Cập nhật trạng thái đơn hàng
**Endpoint:** `PUT /api/don-hang/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **PUT /api/don-hang/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `26` (ID từ TC19)
5. Nhập **request body:**
```json
{
  "Trang_thai_don": "Đang giao"
}
```
6. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Cập nhật đơn hàng thành công",
  "data": {
    "Ma_don_hang": 26,
    "Trang_thai_don": "Đang giao",
    ...
  }
}
```

---

#### ✅ TC23: Cập nhật thông tin người nhận
**Endpoint:** `PUT /api/don-hang/{id}`

**Bước thực hiện:**
1. Mở endpoint **PUT /api/don-hang/{id}**
2. Click **"Try it out"**
3. Nhập **path parameter:**
   - `id`: `26`
4. Nhập **request body:**
```json
{
  "SDT_nguoi_nhan": "0987654321",
  "ten_nguoi_nhan": "Nguyễn Văn B"
}
```
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Cập nhật đơn hàng thành công",
  "data": {
    "Ma_don_hang": 26,
    "SDT_nguoi_nhan": "0987654321",
    "ten_nguoi_nhan": "Nguyễn Văn B",
    ...
  }
}
```

---

#### ✅ TC24: Cập nhật đơn hàng không tồn tại
**Endpoint:** `PUT /api/don-hang/{id}`

**Bước thực hiện:**
1. Mở endpoint **PUT /api/don-hang/{id}**
2. Click **"Try it out"**
3. Nhập **path parameter:**
   - `id`: `99999`
4. Nhập **request body:**
```json
{
  "Trang_thai_don": "Đã giao"
}
```
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 404
- **Response Body:**
```json
{
  "message": "Không tìm thấy đơn hàng"
}
```

---

#### ✅ TC25: Xóa đơn hàng thành công
**Endpoint:** `DELETE /api/don-hang/{id}`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **DELETE /api/don-hang/{id}**
3. Click **"Try it out"**
4. Nhập **path parameter:**
   - `id`: `26` (ID từ TC19)
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "message": "Xóa đơn hàng thành công"
}
```

**Verify:**
- Thử GET /api/don-hang/26 → sẽ trả về 404

---

### 📌 Nhóm 4: REPORTS (4 tests)

#### ✅ TC26: Lấy top tài xế với tham số mặc định
**Endpoint:** `GET /api/bao-cao/top-tai-xe`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/bao-cao/top-tai-xe**
3. Click **"Try it out"**
4. Không nhập gì (dùng default: topN=5, minStar=4.0)
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
[
  {
    "Ma_tai_xe": "TX002",
    "Ten_tai_xe": "Trần Thị B",
    "so_don_giao": 15,
    "diem_trung_binh": 4.9
  },
  {
    "Ma_tai_xe": "TX001",
    "Ten_tai_xe": "Nguyễn Văn A",
    "so_don_giao": 12,
    "diem_trung_binh": 4.8
  }
]
```

---

#### ✅ TC27: Lấy top 3 tài xế với điểm tối thiểu 4.5
**Endpoint:** `GET /api/bao-cao/top-tai-xe`

**Bước thực hiện:**
1. Mở endpoint **GET /api/bao-cao/top-tai-xe**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `topN`: `3`
   - `minStar`: `4.5`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Tối đa 3 tài xế có rating >= 4.5

---

#### ✅ TC28: Lấy top khách hàng với tham số mặc định
**Endpoint:** `GET /api/bao-cao/top-khach-hang`

**Bước thực hiện:**
1. Đảm bảo đã **Authorize** với token
2. Mở endpoint **GET /api/bao-cao/top-khach-hang**
3. Click **"Try it out"**
4. Không nhập gì (dùng default: topN=10, startDate/endDate = null)
5. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:**
```json
[
  {
    "Ma_khach_hang": "KH3",
    "Email": "kh3@example.com",
    "SDT": "0903456789",
    "total_revenue": "270000.00"
  },
  {
    "Ma_khach_hang": "KH1",
    "Email": "kh1@example.com",
    "SDT": "0901234567",
    "total_revenue": "157500.00"
  }
]
```

---

#### ✅ TC29: Lấy top 5 khách hàng trong khoảng thời gian
**Endpoint:** `GET /api/bao-cao/top-khach-hang`

**Bước thực hiện:**
1. Mở endpoint **GET /api/bao-cao/top-khach-hang**
2. Click **"Try it out"**
3. Nhập **query parameters:**
   - `topN`: `5`
   - `startDate`: `2024-11-01`
   - `endDate`: `2024-11-30`
4. Click **"Execute"**

**Kết quả mong đợi:**
- **Status Code:** 200
- **Response Body:** Tối đa 5 khách hàng có đơn hàng "Đã giao" trong tháng 11/2024

---

## 6. Tips & Tricks

### 6.1 Sử dụng "Schemas" để hiểu data model

**Cách xem:**
1. Scroll xuống cuối trang Swagger UI
2. Tìm section **"Schemas"**
3. Click vào schema muốn xem (ví dụ: `Driver`, `Order`)

**Lợi ích:**
- Xem tất cả các trường của model
- Kiểm tra kiểu dữ liệu (string, number, boolean)
- Xác định trường nào bắt buộc (required)

### 6.2 Copy cURL command

**Cách làm:**
1. Sau khi Execute một request
2. Scroll xuống section **"Curl"**
3. Click nút **"Copy"**

**Ví dụ cURL:**
```bash
curl -X 'POST' \
  'http://localhost:3000/api/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "admin",
  "password": "admin123"
}'
```

**Sử dụng:**
- Chạy trực tiếp trong terminal
- Share với team members
- Tích hợp vào scripts

### 6.3 Xem Request URL thực tế

**Cách xem:**
Sau khi Execute, tìm:
```
Request URL:
http://localhost:3000/api/don-hang?page=1&limit=5&trang_thai_don=Đã%20giao
```

**Lợi ích:**
- Debug query parameters
- Kiểm tra URL encoding
- Copy để test trên browser

### 6.4 Xem Response Headers

**Cách xem:**
1. Sau khi Execute
2. Scroll xuống section **"Response headers"**

**Ví dụ:**
```
content-type: application/json; charset=utf-8
date: Sat, 16 Nov 2024 10:30:00 GMT
server: Express
x-powered-by: Express
```

### 6.5 Download Response

**Cách làm:**
1. Sau khi nhận response
2. Click nút **"Download"** ở góc phải Response Body

**Lợi ích:**
- Lưu response lớn vào file JSON
- Phân tích dữ liệu offline
- Backup test results

### 6.6 Clear Response

**Cách làm:**
Click nút **"Clear"** ở góc phải Response section

**Khi nào dùng:**
- Trước khi test lại endpoint
- Để làm sạch màn hình
- Khi muốn bắt đầu fresh

### 6.7 Collapse/Expand Endpoints

**Cách làm:**
- Click vào **▼** để mở endpoint
- Click vào **▶** để đóng endpoint
- Click vào tag name để collapse/expand toàn bộ nhóm

### 6.8 Test nhiều endpoints liên tiếp

**Workflow hiệu quả:**
1. **Login** → Copy token
2. **Authorize** một lần
3. Test tất cả protected endpoints
4. Không cần re-login cho mỗi request

### 6.9 Sử dụng browser DevTools

**Cách làm:**
1. Mở DevTools (F12)
2. Vào tab **Network**
3. Execute request từ Swagger UI
4. Xem chi tiết request/response trong DevTools

**Lợi ích:**
- Xem raw request/response
- Debug timing issues
- Kiểm tra headers chi tiết

---

## 7. Troubleshooting

### ❌ Lỗi: "Failed to fetch"

**Nguyên nhân:**
- Server chưa chạy
- CORS policy block

**Giải pháp:**
```powershell
# Kiểm tra server
cd D:\HK251\Database\BTL2\PART3\backend
node server.js

# Đảm bảo thấy message:
# ✅ Database đã kết nối thành công!
# 🚀 Server chạy trên port 3000
```

---

### ❌ Lỗi: 401 Unauthorized (khi test protected endpoint)

**Nguyên nhân:**
- Chưa Authorize với token
- Token đã hết hạn (expired)

**Giải pháp:**
1. Check icon Authorize: phải là 🔒 (locked)
2. Nếu là 🔓 (unlocked) → Authorize lại
3. Token hết hạn → Login lại để lấy token mới
4. Kiểm tra không paste thừa "Bearer " trước token

---

### ❌ Lỗi: 404 Not Found

**Nguyên nhân:**
- URL endpoint sai
- Path parameter sai

**Giải pháp:**
- Kiểm tra **Request URL** trong response
- Verify path parameter (ID) có tồn tại không
- Đảm bảo không có space thừa trong path param

---

### ❌ Lỗi: 400 Bad Request

**Nguyên nhân:**
- Request body không đúng format
- Thiếu trường bắt buộc
- Kiểu dữ liệu sai

**Giải pháp:**
1. Kiểm tra JSON syntax (dấu phẩy, dấu ngoặc)
2. Xem schema ở cuối trang để verify trường bắt buộc
3. Verify kiểu dữ liệu:
   - String: `"value"`
   - Number: `123`
   - Boolean: `true/false`
   - Date: `"YYYY-MM-DD"`

---

### ❌ Swagger UI không load được schemas

**Nguyên nhân:**
- swagger-jsdoc không parse được JSDoc comments
- Đường dẫn `apis` trong config sai

**Giải pháp:**
1. Kiểm tra console browser (F12)
2. Restart server
3. Clear browser cache
4. Verify file `config/swagger.js`:
```javascript
apis: ['./routes/*.js', './controllers/*.js']
```

---

### ❌ Response không hiển thị Vietnamese characters

**Nguyên nhân:**
- Encoding issue

**Giải pháp:**
- Kiểm tra Response Headers có `content-type: application/json; charset=utf-8`
- Nếu không, fix trong server.js:
```javascript
app.use(express.json({ charset: 'utf-8' }));
```

---

### ❌ Không thấy endpoint mới sau khi thêm vào code

**Nguyên nhân:**
- Chưa restart server
- JSDoc comment sai format

**Giải pháp:**
1. **Restart server:**
```powershell
# Ctrl+C để stop
# Chạy lại
node server.js
```

2. **Refresh browser:**
```
Ctrl+Shift+R (hard refresh)
```

3. **Verify JSDoc format:**
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Description
 *     tags: [Tag Name]
 *     ...
 */
```

---

### ❌ Token expire quá nhanh

**Nguyên nhân:**
- JWT expiresIn setting quá ngắn

**Giải pháp:**
- Sửa trong middleware/authMiddleware.js:
```javascript
const token = jwt.sign(
  { username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' } // Tăng từ 1h lên 8h nếu cần
);
```

---

## 🎉 Kết luận

### Tóm tắt quy trình test trên Swagger UI:

1. ✅ **Start server** → `node server.js`
2. ✅ **Open Swagger UI** → http://localhost:3000/api-docs
3. ✅ **Login** → POST /api/auth/login → Copy token
4. ✅ **Authorize** → Click 🔓 → Paste token → Click "Authorize"
5. ✅ **Test endpoints** → Click "Try it out" → Fill data → Click "Execute"
6. ✅ **Verify response** → Check status code + response body

### Ưu điểm Swagger UI:
- ✅ Không cần cài đặt tools bên ngoài
- ✅ Tự động đồng bộ với code
- ✅ Interactive và trực quan
- ✅ Có schemas reference
- ✅ Export được cURL commands

### So sánh Swagger UI vs Postman:

| Feature | Swagger UI | Postman |
|---------|-----------|---------|
| Installation | Không cần | Cần cài app |
| Sync with code | Tự động | Manual update |
| Authentication | Built-in | Manual setup |
| Collections | Auto-generated | Manual create |
| Sharing | URL link | Export file |
| Advanced testing | Limited | Powerful |

**Khuyến nghị:**
- **Swagger UI:** Cho quick testing, development, demo
- **Postman:** Cho comprehensive testing, automation, CI/CD

---

## 📚 Tài liệu tham khảo

- Swagger UI: https://swagger.io/tools/swagger-ui/
- OpenAPI Specification: https://swagger.io/specification/
- TEST_GUIDE_POSTMAN.md: Hướng dẫn chi tiết test bằng Postman
- README.md: Tổng quan hệ thống
- TEST_CASE.md: Test cases chi tiết

---

**Created:** 2024-11-16  
**Last Updated:** 2024-11-16  
**Author:** Copilot  
**Project:** Delivery Management System - BTL2 Database  
**Version:** 1.0.0

---

**Happy Testing! 🚀**