# 📚 HƯỚNG DẪN TEST API SWAGGER


## 🎯 GIAI ĐOẠN 1: AUTHENTICATION & DRIVER MANAGEMENT

### 📋 Tổng quan
- **Tổng số test:** 9 testcases
- **Nhóm 1:** Authentication (3 tests)
- **Nhóm 2:** Driver Management (6 tests)

---

## 🔐 NHÓM 1: AUTHENTICATION (3 tests)

### ✅ TC-AUTH-01: Đăng nhập thành công

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "sManager",
  "password": "Nhom6251"
}
```

**Expected Response (200):**
```json
{
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ghi chú:** Copy token để Authorize

---

### ❌ TC-AUTH-02: Đăng nhập thất bại - Sai username

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "wronguser",
  "password": "Nhom6251"
}
```

**Expected Response (401):**
```json
{
  "message": "Sai thông tin đăng nhập!"
}
```

---

### ❌ TC-AUTH-03: Đăng nhập thất bại - Sai password

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "sManager",
  "password": "wrongpassword"
}
```

**Expected Response (401):**
```json
{
  "message": "Sai thông tin đăng nhập!"
}
```

---

## 👤 NHÓM 2: DRIVER MANAGEMENT (6 tests)

> ⚠️ **Lưu ý:** Phải Authorize với token trước khi test nhóm này

---

### ✅ TC-DRV-01: Tạo tài xế mới thành công

**Endpoint:** `POST /api/driver`

**Request Body:**
```json
{
  "DriverID": "DRVTEST01",
  "Ho_ten": "Nguyen Van Test",
  "CCCD": "001234567890",
  "Gioi_Tinh": "Nam",
  "Ngay_Sinh": "1995-05-15",
  "Ngay_Bat_Dau_Lam_Viec": "2024-01-01",
  "Rating": 5.0,
  "Ma_Nhan_Vien_quan_li": "NV0002",
  "Trang_Thai": "Sẵn sàng",
  "Ngay_Bat_Dau_Quan_Ly": "2024-01-01"
}
```

**Expected Response (201):**
```json
{
  "message": "Tài xế tạo thành công",
  "data": {
    "DriverID": "DRVTEST01",
    "Ho_ten": "Nguyen Van Test",
    "CCCD": "001234567890",
    "Rating": 5
  }
}
```

---

### ❌ TC-DRV-02: Tạo tài xế thất bại - Thiếu trường bắt buộc

**Endpoint:** `POST /api/driver`

**Request Body:**
```json
{
  "DriverID": "DRVTEST02",
  "CCCD": "001234567891"
}
```

**Expected Response (400):**
```json
{
  "errors": [
    {
      "msg": "Họ tên không được để trống",
      "path": "Ho_ten"
    }
  ]
}
```

---

### ✅ TC-DRV-03: Lấy danh sách tất cả tài xế

**Endpoint:** `GET /api/driver`

**Request:** Không cần body

**Expected Response (200):**
```json
{
  "message": "Danh sách tài xế",
  "data": [
    {
      "DriverID": "DRV001",
      "Ho_ten": "Nguyễn Văn Rê",
      "Rating": 5,
      "Trang_Thai": "Sẵn sàng"
    }
  ]
}
```

---

### ✅ TC-DRV-04: Lấy thông tin tài xế theo ID

**Endpoint:** `GET /api/driver/{id}`

**Path Parameter:** `id = DRV001`

**Expected Response (200):**
```json
{
  "message": "Thông tin tài xế",
  "data": {
    "DriverID": "DRV001",
    "Ho_ten": "Nguyễn Văn Rê",
    "CCCD": "079123456781",
    "Rating": 5
  }
}
```

---

### ✅ TC-DRV-05: Cập nhật thông tin tài xế

**Endpoint:** `PUT /api/driver/{id}`

**Path Parameter:** `id = DRVTEST01`

**Request Body:**
```json
{
  "Ho_ten": "Nguyen Van Test Updated",
  "Rating": 4.8
}
```

**Expected Response (200):**
```json
{
  "message": "Cập nhật tài xế thành công",
  "data": {
    "DriverID": "DRVTEST01",
    "Ho_ten": "Nguyen Van Test Updated",
    "Rating": 4.8
  }
}
```

---

### ✅ TC-DRV-06: Xóa tài xế

**Endpoint:** `DELETE /api/driver/{id}`

**Path Parameter:** `id = DRVTEST01`

**Expected Response (200):**
```json
{
  "message": "Xóa tài xế thành công"
}
```

**Verify:** GET `/api/driver/DRVTEST01` → 404

---

## 📝 QUY TRÌNH TEST

### Bước 1: Khởi động server
```powershell
cd backend
node server.js
```

### Bước 2: Truy cập Swagger
http://localhost:3000/api-docs

### Bước 3: Test Authentication
1. TC-AUTH-01 → Copy token
2. Click "Authorize" 🔓 → Paste token
3. TC-AUTH-02, TC-AUTH-03

### Bước 4: Test Driver Management
1. TC-DRV-01 → Tạo tài xế test
2. TC-DRV-02 → Validate error
3. TC-DRV-03 → List all
4. TC-DRV-04 → Get by ID
5. TC-DRV-05 → Update
6. TC-DRV-06 → Delete & verify

---

## 🎯 KẾT QUẢ DỰ KIẾN

| Test ID | Endpoint | Method | Expected Status |
|---------|----------|--------|-----------------|
| TC-AUTH-01 | /api/auth/login | POST | 200 ✅ |
| TC-AUTH-02 | /api/auth/login | POST | 401 ❌ |
| TC-AUTH-03 | /api/auth/login | POST | 401 ❌ |
| TC-DRV-01 | /api/driver | POST | 201 ✅ |
| TC-DRV-02 | /api/driver | POST | 400 ❌ |
| TC-DRV-03 | /api/driver | GET | 200 ✅ |
| TC-DRV-04 | /api/driver/{id} | GET | 200 ✅ |
| TC-DRV-05 | /api/driver/{id} | PUT | 200 ✅ |
| TC-DRV-06 | /api/driver/{id} | DELETE | 200 ✅ |

---

---

## 🎯 GIAI ĐOẠN 2: ORDER & DELIVERY & REPORT MANAGEMENT

### 📋 Tổng quan
- **Tổng số test:** 17 testcases
- **Nhóm 3:** Order Management (6 tests)
- **Nhóm 4:** Delivery Management (6 tests)  
- **Nhóm 5:** Report Management (5 tests)

---

## 📦 NHÓM 3: ORDER MANAGEMENT (6 tests)

> ⚠️ **Lưu ý:** Phải Authorize với token trước khi test

---

### ✅ TC-ORD-01: Tạo đơn hàng mới

**Endpoint:** `POST /api/don-hang`

**Request Body:**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Nguyễn Văn Test",
  "dia_chi_lay_hang": "123 Lê Lợi, Quận 1, TP.HCM",
  "dia_chi_giao_hang": "456 Nguyễn Huệ, Quận 3, TP.HCM",
  "can_nang": 2.5,
  "gia_tri_hang_hoa_phi_van_chuyen": 150000,
  "phuong_thuc_giao_hang": "Giao nhanh",
  "Thoi_gian_giao_hang_du_kien": "2025-11-25T15:00:00"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "Ma_don_hang": "DH0013",
    "Trang_thai_don": "Đang xử lý",
    "phi_van_chuyen_goc": 157500,
    "so_tien_duoc_giam": 0,
    "phi_van_chuyen_sau_giam": 157500,
    "quang_duong": 10.5
  }
}
```

**Ghi chú:** Lưu lại `Ma_don_hang`

---

### ✅ TC-ORD-02: Lấy đơn hàng theo ID

**Endpoint:** `GET /api/don-hang/{id}`

**Path Parameter:** `id = DH0013` (từ TC-ORD-01)

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "Ma_don_hang": "DH0013",
    "Trang_thai_don": "Đang xử lý",
    "phi_van_chuyen_goc": 157500,
    "khachHang": {
      "Ma_khach_hang": "KH1",
      "Ten_hang": "Công ty ABC"
    }
  }
}
```

---

### ✅ TC-ORD-03: Cập nhật trạng thái đơn hàng (11 trạng thái mới)

**Endpoint:** `PUT /api/don-hang/{id}`

**Path Parameter:** `id = DH0013`

**Request Body:**
```json
{
  "Trang_thai_don": "Đang tìm tài xế"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật đơn hàng thành công",
  "data": {
    "Ma_don_hang": "DH0013",
    "Trang_thai_don": "Đang tìm tài xế"
  }
}
```

---

### ✅ TC-ORD-04: Lấy danh sách đơn hàng với pagination

**Endpoint:** `GET /api/don-hang`

**Query Parameters:**
- `page`: `1`
- `limit`: `5`
- `sortKey`: `quang_duong`
- `sortOrder`: `DESC`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_don_hang": "DH0013",
      "quang_duong": 10.5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3
  }
}
```

---

### ✅ TC-ORD-05: Lọc đơn hàng theo trạng thái

**Endpoint:** `GET /api/don-hang`

**Query Parameters:**
- `Trang_thai_don`: `Đang xử lý`
- `page`: `1`
- `limit`: `10`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_don_hang": "DH0013",
      "Trang_thai_don": "Đang xử lý"
    }
  ]
}
```

---

### ✅ TC-ORD-06: Xóa đơn hàng

**Endpoint:** `DELETE /api/don-hang/{id}`

**Path Parameter:** `id = DH0013`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Xóa đơn hàng thành công"
}
```

**Verify:** GET `/api/don-hang/DH0013` → 404

---

## 🚚 NHÓM 4: DELIVERY MANAGEMENT (6 tests)

> ⚠️ **ERD v2 Feature:** Quản lý chuyến giao hàng mới

---

### ✅ TC-DEL-01: Tạo chuyến giao hàng mới

**Endpoint:** `POST /api/chuyen-giao-hang`

**Request Body:**
```json
{
  "DriverID": "DRV001"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Tạo chuyến giao hàng thành công",
  "data": {
    "DeliveryID": "CGH006",
    "DriverID": "DRV001",
    "so_luong_don_gop": 0,
    "TrangThaiChuyen": "Đang thực hiện"
  }
}
```

**Ghi chú:** Lưu lại `DeliveryID`

---

### ✅ TC-DEL-02: Gộp đơn hàng vào chuyến

**Endpoint:** `POST /api/chuyen-giao-hang/{id}/add-don-hang`

**Path Parameter:** `id = CGH006`

**Request Body:**
```json
{
  "Ma_don_hang": "DH0001",
  "Thu_tu_lay_hang": 1,
  "Thu_tu_giao_hang": 1
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Gộp đơn hàng vào chuyến thành công",
  "data": {
    "DeliveryID": "CGH006",
    "Ma_don_hang": "DH0001",
    "so_luong_don_gop_moi": 1
  }
}
```

---

### ✅ TC-DEL-03: Xem chi tiết chuyến với tổng quãng đường

**Endpoint:** `GET /api/chuyen-giao-hang/{id}`

**Path Parameter:** `id = CGH006`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "DeliveryID": "CGH006",
    "so_luong_don_gop": 1,
    "taiXe": {
      "DriverID": "DRV001",
      "Ho_ten": "Nguyễn Văn Rê"
    },
    "donHangs": [
      {
        "Ma_don_hang": "DH0001",
        "quang_duong": 10.5
      }
    ],
    "tong_quang_duong_tinh_toan": "10.50"
  }
}
```

---

### ✅ TC-DEL-04: Tính tổng quãng đường chuyến

**Endpoint:** `GET /api/chuyen-giao-hang/{id}/total-distance`

**Path Parameter:** `id = CGH006`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "DeliveryID": "CGH006",
    "so_luong_don": 1,
    "tong_quang_duong_km": "10.50"
  }
}
```

---

### ✅ TC-DEL-05: Cập nhật trạng thái chuyến

**Endpoint:** `PUT /api/chuyen-giao-hang/{id}`

**Path Parameter:** `id = CGH006`

**Request Body:**
```json
{
  "TrangThaiChuyen": "Hoàn thành"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật chuyến giao hàng thành công",
  "data": {
    "DeliveryID": "CGH006",
    "TrangThaiChuyen": "Hoàn thành"
  }
}
```

---

### ✅ TC-DEL-06: Lấy danh sách chuyến giao hàng

**Endpoint:** `GET /api/chuyen-giao-hang`

**Query Parameters:**
- `page`: `1`
- `limit`: `10`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "DeliveryID": "CGH006",
      "DriverID": "DRV001",
      "so_luong_don_gop": 1,
      "TrangThaiChuyen": "Hoàn thành"
    }
  ]
}
```

---

## 📊 NHÓM 5: REPORT MANAGEMENT (5 tests)

---

### ✅ TC-RPT-01: Lấy top tài xế (mặc định)

**Endpoint:** `GET /api/bao-cao/top-tai-xe`

**Query Parameters:** (để trống - dùng default)

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_tai_xe": "DRV001",
      "Ten_tai_xe": "Nguyễn Văn Rê",
      "so_don_giao": 15,
      "diem_trung_binh": 5.0
    }
  ]
}
```

---

### ✅ TC-RPT-02: Lấy top 3 tài xế với điểm tối thiểu 4.5

**Endpoint:** `GET /api/bao-cao/top-tai-xe`

**Query Parameters:**
- `topN`: `3`
- `minStar`: `4.5`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_tai_xe": "DRV001",
      "diem_trung_binh": 5.0
    }
  ]
}
```

---

### ✅ TC-RPT-03: Lấy top khách hàng (mặc định)

**Endpoint:** `GET /api/bao-cao/top-khach-hang`

**Query Parameters:** (để trống)

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_khach_hang": "KH1",
      "Email": "kh1@example.com",
      "total_revenue": "270000.00"
    }
  ]
}
```

---

### ✅ TC-RPT-04: Lấy top 3 khách hàng trong khoảng thời gian

**Endpoint:** `GET /api/bao-cao/top-khach-hang`

**Query Parameters:**
- `topN`: `3`
- `startDate`: `2025-10-26`
- `endDate`: `2025-10-28`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "Ma_khach_hang": "KH1",
      "total_revenue": "270000.00"
    }
  ]
}
```

---

### ✅ TC-RPT-05: Báo cáo với tham số không hợp lệ

**Endpoint:** `GET /api/bao-cao/top-tai-xe`

**Query Parameters:**
- `topN`: `-1`
- `minStar`: `6.0`

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Tham số không hợp lệ"
}
```

---

## 📝 QUY TRÌNH TEST GIAI ĐOẠN 2

### Bước 1: Test Order Management
1. TC-ORD-01 → Tạo đơn hàng test
2. TC-ORD-02 → Get by ID
3. TC-ORD-03 → Update status
4. TC-ORD-04 → List with sort
5. TC-ORD-05 → Filter by status
6. TC-ORD-06 → Delete & verify

### Bước 2: Test Delivery Management
1. TC-DEL-01 → Tạo chuyến mới
2. TC-DEL-02 → Gộp đơn vào chuyến
3. TC-DEL-03 → Get detail với tổng km
4. TC-DEL-04 → Calculate distance
5. TC-DEL-05 → Update status
6. TC-DEL-06 → List all

### Bước 3: Test Report Management
1. TC-RPT-01 → Top drivers default
2. TC-RPT-02 → Top drivers filtered
3. TC-RPT-03 → Top customers default
4. TC-RPT-04 → Top customers filtered
5. TC-RPT-05 → Invalid params

---

## 🎯 KẾT QUẢ DỰ KIẾN - GIAI ĐOẠN 2

| Test ID | Endpoint | Method | Status |
|---------|----------|--------|--------|
| **Order Management** ||||
| TC-ORD-01 | /api/don-hang | POST | 201 ✅ |
| TC-ORD-02 | /api/don-hang/{id} | GET | 200 ✅ |
| TC-ORD-03 | /api/don-hang/{id} | PUT | 200 ✅ |
| TC-ORD-04 | /api/don-hang | GET | 200 ✅ |
| TC-ORD-05 | /api/don-hang | GET | 200 ✅ |
| TC-ORD-06 | /api/don-hang/{id} | DELETE | 200 ✅ |
| **Delivery Management** ||||
| TC-DEL-01 | /api/chuyen-giao-hang | POST | 201 ✅ |
| TC-DEL-02 | /api/.../add-don-hang | POST | 200 ✅ |
| TC-DEL-03 | /api/chuyen-giao-hang/{id} | GET | 200 ✅ |
| TC-DEL-04 | /api/.../total-distance | GET | 200 ✅ |
| TC-DEL-05 | /api/chuyen-giao-hang/{id} | PUT | 200 ✅ |
| TC-DEL-06 | /api/chuyen-giao-hang | GET | 200 ✅ |
| **Report Management** ||||
| TC-RPT-01 | /api/bao-cao/top-tai-xe | GET | 200 ✅ |
| TC-RPT-02 | /api/bao-cao/top-tai-xe | GET | 200 ✅ |
| TC-RPT-03 | /api/bao-cao/top-khach-hang | GET | 200 ✅ |
| TC-RPT-04 | /api/bao-cao/top-khach-hang | GET | 200 ✅ |
| TC-RPT-05 | /api/bao-cao/top-tai-xe | GET | 400 ❌ |

---

## 📈 TỔNG KẾT TOÀN BỘ

**Tổng số test:** 26 testcases  
- Giai đoạn 1: 9 tests (Auth + Driver)  
- Giai đoạn 2: 17 tests (Order + Delivery + Report)

---

**Status:** Tui đã test và Pass All Test ✅
