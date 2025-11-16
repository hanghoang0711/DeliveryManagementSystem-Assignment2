# 🧪 HƯỚNG DẪN TEST API BẰNG POSTMAN

## 📋 Mục Lục
1. [Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
2. [Setup Postman](#2-setup-postman)
3. [Test Authentication](#3-test-authentication)
4. [Test Driver Management](#4-test-driver-management)
5. [Test Order Management](#5-test-order-management)
6. [Test Reports](#6-test-reports)
7. [Import Collection](#7-import-collection)

---

## 1. Chuẩn bị môi trường

### ✅ Bước 1.1: Start Server
Mở **Terminal** và chạy:
```bash
cd D:\HK251\Database\BTL2\PART3\backend
node server.js
```

**Expected Output:**
```
✅ Kết nối database thành công!
🚀 Server chạy trên port 3000
📍 Auth: http://localhost:3000/api/auth/login
📍 Driver: http://localhost:3000/api/driver
📍 Orders: http://localhost:3000/api/don-hang
📍 Reports: http://localhost:3000/api/bao-cao
```

### ✅ Bước 1.2: Download Postman
- Tải Postman tại: https://www.postman.com/downloads/
- Hoặc sử dụng Postman Web: https://web.postman.com/

---

## 2. Setup Postman

### ✅ Bước 2.1: Tạo Collection mới
1. Mở Postman
2. Click **"New"** → **"Collection"**
3. Đặt tên: **"Delivery Management API"**
4. Click **"Create"**

### ✅ Bước 2.2: Tạo Environment Variables
1. Click **"Environments"** (icon ⚙️)
2. Click **"Create Environment"**
3. Đặt tên: **"Local Development"**
4. Thêm biến:
   - **Variable:** `base_url` | **Initial Value:** `http://localhost:3000`
   - **Variable:** `token` | **Initial Value:** *(để trống)*
5. Click **"Save"**
6. Chọn **"Local Development"** từ dropdown ở góc phải

### ✅ Bước 2.3: Setup Authorization Script
Sau khi login thành công, token sẽ được tự động lưu vào biến `token`.

---

## 3. Test Authentication

### 📌 Test 3.1: Login thành công ✅

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "sManager",
  "password": "Nhom6251"
}
```

**Test Script (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.test("✅ Login Success", () => {
        pm.expect(jsonData.token).to.exist;
    });
} else {
    pm.test("❌ Login Failed", () => {
        pm.expect.fail("Expected 200 OK");
    });
}
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Token tự động lưu vào Environment variable**

---

### 📌 Test 3.2: Login thất bại (sai password) ❌

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body:**
```json
{
  "username": "sManager",
  "password": "wrongpassword"
}
```

**Test Script:**
```javascript
pm.test("✅ Status 401", () => {
    pm.response.to.have.status(401);
});

pm.test("✅ Error message present", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.exist;
});
```

**Expected Result:**
- **Status:** `401 Unauthorized`
- **Response:**
```json
{
  "message": "Sai thông tin đăng nhập!"
}
```

---

### 📌 Test 3.3: Login thất bại (user không tồn tại) ❌

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body:**
```json
{
  "username": "nonexistuser",
  "password": "anypassword"
}
```

**Expected Result:**
- **Status:** `401 Unauthorized`
- **Response:**
```json
{
  "message": "Sai thông tin đăng nhập!"
}
```

---

## 4. Test Driver Management

### 📌 Setup Authorization
Cho tất cả request từ đây trở đi, thêm **Authorization Header**:

**Cách 1: Thủ công (mỗi request)**
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Cách 2: Tự động (Collection level)**
1. Click vào Collection **"Delivery Management API"**
2. Tab **"Authorization"**
3. Type: **"Bearer Token"**
4. Token: `{{token}}`
5. Click **"Save"**

---

### 📌 Test 4.1: GET tất cả tài xế ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/driver`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Test Script:**
```javascript
pm.test("✅ Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("✅ Drivers array exists", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});

// Lưu DriverID đầu tiên để test GET by ID
if (pm.response.json().data.length > 0) {
    pm.environment.set("first_driver_id", pm.response.json().data[0].DriverID);
}
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Danh sách tài xế",
  "data": [
    {
      "DriverID": "DRV001",
      "Ho_ten": "Nguyễn Văn Rê",
      "CCCD": "079123456781",
      "Rating": 5.0,
      "Trang_Thai": "Sẵn sàng"
    }
  ]
}
```

---

### 📌 Test 4.2: GET tài xế by ID ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/driver/{{first_driver_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Test Script:**
```javascript
pm.test("✅ Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("✅ Driver data exists", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.DriverID).to.exist;
});
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Thông tin tài xế",
  "data": {
    "DriverID": "DRV001",
    "Ho_ten": "Nguyễn Văn Rê",
    "CCCD": "079123456781",
    "Rating": 5.0
  }
}
```

---

### 📌 Test 4.3: GET driver không tồn tại (404) ❌

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/driver/DRV9999`

**Expected Result:**
- **Status:** `404 Not Found`
- **Response:**
```json
{
  "message": "Không tìm thấy tài xế"
}
```

---

### 📌 Test 4.4: CREATE tài xế mới ✅

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/driver`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "DriverID": "DRVTEST01",
  "Ho_ten": "Nguyen Van Test Driver",
  "CCCD": "123456789999",
  "Gioi_Tinh": "Nam",
  "Ngay_Sinh": "1990-01-01",
  "Ngay_Bat_Dau_Lam_Viec": "2020-01-01",
  "Rating": 5.0,
  "Ma_Nhan_Vien_quan_li": "NV001",
  "Trang_Thai": "Sẵn sàng",
  "Ngay_Bat_Dau_Quan_Ly": "2020-01-01"
}
```

**Test Script:**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("test_driver_id", jsonData.data.DriverID);
    pm.test("✅ Driver created", () => {
        pm.expect(jsonData.data.DriverID).to.equal("DRVTEST01");
    });
}
```

**Expected Result:**
- **Status:** `201 Created`
- **Response:**
```json
{
  "message": "Tạo tài xế thành công",
  "data": {
    "DriverID": "DRVTEST01",
    "Ho_ten": "Nguyen Van Test Driver",
    "Rating": 5.0
  }
}
```

---

### 📌 Test 4.5: UPDATE tài xế ✅

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/driver/{{test_driver_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "Ho_ten": "Nguyen Van Test UPDATED",
  "Rating": 4.8
}
```

**Test Script:**
```javascript
pm.test("✅ Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("✅ Driver updated", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.Ho_ten).to.equal("Nguyen Van Test UPDATED");
    pm.expect(jsonData.data.Rating).to.equal(4.8);
});
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Cập nhật tài xế thành công",
  "data": {
    "DriverID": "DRVTEST01",
    "Ho_ten": "Nguyen Van Test UPDATED",
    "Rating": 4.8
  }
}
```

---

### 📌 Test 4.6: DELETE tài xế ✅

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/driver/{{test_driver_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Test Script:**
```javascript
pm.test("✅ Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("✅ Delete message", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Xóa tài xế thành công");
});
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Xóa tài xế thành công"
}
```

---

## 5. Test Order Management

### 📌 Test 5.1: GET tất cả đơn hàng ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Test Script:**
```javascript
pm.test("✅ Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("✅ Orders exist", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
    pm.expect(jsonData.pagination).to.exist;
});
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách đơn hàng thành công",
  "data": [...],
  "pagination": {
    "totalOrders": 10,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

---

### 📌 Test 5.2: Filter đơn hàng theo trạng thái ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang?trang_thai_don=Đã tạo`

**Expected Result:**
- **Status:** `200 OK`
- Chỉ trả về đơn hàng có `Trang_thai_don = "Đã tạo"`

---

### 📌 Test 5.3: Filter theo khách hàng ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang?ma_khach_hang=KH1`

**Expected Result:**
- **Status:** `200 OK`
- Chỉ trả về đơn hàng của khách hàng KH1

---

### 📌 Test 5.4: Sort theo giá (ASC) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang?sortKey=gia_tri_hang_hoa_phi_van_chuyen&sortOrder=ASC`

**Expected Result:**
- **Status:** `200 OK`
- Đơn hàng sắp xếp từ thấp đến cao

---

### 📌 Test 5.5: Sort theo giá (DESC) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang?sortKey=gia_tri_hang_hoa_phi_van_chuyen&sortOrder=DESC`

**Expected Result:**
- **Status:** `200 OK`
- Đơn hàng sắp xếp từ cao đến thấp

---

### 📌 Test 5.6: Pagination ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang?page=1&limit=2`

**Test Script:**
```javascript
pm.test("✅ Pagination working", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.pagination.currentPage).to.equal(1);
    pm.expect(jsonData.data.length).to.be.at.most(2);
});
```

**Expected Result:**
- **Status:** `200 OK`
- Trả về tối đa 2 đơn hàng

---

### 📌 Test 5.7: GET đơn hàng by ID ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang/DH001`

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "success": true,
  "data": {
    "Ma_don_hang": "DH001",
    "Trang_thai_don": "Đang giao",
    "gia_tri_hang_hoa_phi_van_chuyen": 85000
  }
}
```

---

### 📌 Test 5.8: GET đơn hàng không tồn tại (404) ❌

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/don-hang/DH9999`

**Expected Result:**
- **Status:** `404 Not Found`
- **Response:**
```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng với mã DH9999"
}
```

---

### 📌 Test 5.9: CREATE đơn hàng mới ✅

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/don-hang`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0912345678",
  "ten_nguoi_nhan": "Nguyen Van Test Order",
  "dia_chi_lay_hang": "123 Test Street, District 1, HCMC",
  "dia_chi_giao_hang": "456 Delivery Street, District 3, HCMC",
  "can_nang": 2.5,
  "gia_tri_hang_hoa_phi_van_chuyen": 250000,
  "phuong_thuc_giao_hang": "Nhanh",
  "Thoi_gian_giao_hang_du_kien": "2025-12-31T14:00:00",
  "Thoi_gian_lay_hang_du_kien": "2025-12-30T10:00:00"
}
```

**Test Script:**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("test_order_id", jsonData.data.Ma_don_hang);
    pm.test("✅ Order created", () => {
        pm.expect(jsonData.data.Ma_don_hang).to.exist;
    });
}
```

**Expected Result:**
- **Status:** `201 Created`
- **Response:**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "Ma_don_hang": "DH0011",
    "Trang_thai_don": "Đã tạo"
  }
}
```

---

### 📌 Test 5.10: CREATE đơn hàng thiếu field bắt buộc ❌

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/don-hang`
- **Body (thiếu Ma_khach_hang):**
```json
{
  "SDT_nguoi_nhan": "0912345678",
  "ten_nguoi_nhan": "Test User"
}
```

**Expected Result:**
- **Status:** `400 Bad Request`
- **Response:**
```json
{
  "success": false,
  "message": "Thiếu thông tin bắt buộc"
}
```

---

### 📌 Test 5.11: CREATE đơn hàng với khách hàng không tồn tại ❌

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/don-hang`
- **Body:**
```json
{
  "Ma_khach_hang": "KH9999",
  "SDT_nguoi_nhan": "0912345678",
  "ten_nguoi_nhan": "Test User",
  "dia_chi_lay_hang": "123 Test",
  "dia_chi_giao_hang": "456 Delivery",
  "can_nang": 2.5,
  "gia_tri_hang_hoa_phi_van_chuyen": 250000,
  "Thoi_gian_giao_hang_du_kien": "2025-12-31T14:00:00"
}
```

**Expected Result:**
- **Status:** `404 Not Found`
- **Response:**
```json
{
  "success": false,
  "message": "Khách hàng không tồn tại"
}
```

---

### 📌 Test 5.12: UPDATE đơn hàng (trạng thái) ✅

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/don-hang/{{test_order_id}}`
- **Body:**
```json
{
  "Trang_thai_don": "Đang xử lý"
}
```

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "success": true,
  "message": "Cập nhật đơn hàng thành công",
  "data": {
    "Ma_don_hang": "DH0011",
    "Trang_thai_don": "Đang xử lý"
  }
}
```

---

### 📌 Test 5.13: UPDATE nhiều field cùng lúc ✅

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/don-hang/{{test_order_id}}`
- **Body:**
```json
{
  "Trang_thai_don": "Đang giao",
  "SDT_nguoi_nhan": "0988888888",
  "ten_nguoi_nhan": "Nguyen Van A - Updated"
}
```

**Expected Result:**
- **Status:** `200 OK`
- Tất cả 3 field được cập nhật

---

### 📌 Test 5.14: UPDATE đơn hàng không tồn tại ❌

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/don-hang/DH9999`
- **Body:**
```json
{
  "Trang_thai_don": "Đang xử lý"
}
```

**Expected Result:**
- **Status:** `404 Not Found`

---

### 📌 Test 5.15: DELETE đơn hàng ✅

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/don-hang/{{test_order_id}}`

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "success": true,
  "message": "Xóa đơn hàng thành công"
}
```

---

### 📌 Test 5.16: DELETE đơn hàng không tồn tại ❌

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/don-hang/DH9999`

**Expected Result:**
- **Status:** `404 Not Found`

---

## 6. Test Reports

### 📌 Test 6.1: Top Drivers (default) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bao-cao/top-tai-xe`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Báo cáo top tài xế",
  "data": [
    {
      "Ma_tai_xe": "DRV003",
      "Ten_tai_xe": "Đỗ Giang Thần",
      "so_don_giao": 0,
      "diem_trung_binh": 5.0
    }
  ]
}
```

---

### 📌 Test 6.2: Top Drivers (custom params) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bao-cao/top-tai-xe?topN=5&minStar=4.5`

**Expected Result:**
- **Status:** `200 OK`
- Trả về tối đa 5 drivers với rating >= 4.5

---

### 📌 Test 6.3: Top Customers (default) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bao-cao/top-khach-hang`

**Expected Result:**
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Báo cáo top khách hàng",
  "data": [
    {
      "Ma_khach_hang": "KH3",
      "Email": "lehoang@email.com",
      "SDT": "0987654321",
      "total_revenue": 270000
    }
  ]
}
```

---

### 📌 Test 6.4: Top Customers (custom params) ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/bao-cao/top-khach-hang?topN=3&startDate=2024-01-01&endDate=2025-12-31`

**Expected Result:**
- **Status:** `200 OK`
- Trả về tối đa 3 khách hàng trong khoảng thời gian

---

## 7. Import Collection

### 📥 Import Postman Collection (JSON)

Tạo file `Delivery_Management_API.postman_collection.json`:

```json
{
  "info": {
    "name": "Delivery Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login Success",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const jsonData = pm.response.json();",
                  "    pm.environment.set('token', jsonData.token);",
                  "    pm.test('✅ Login Success', () => {",
                  "        pm.expect(jsonData.token).to.exist;",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"sManager\",\n  \"password\": \"Nhom6251\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Driver Management",
      "item": [
        {
          "name": "GET All Drivers",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/driver",
              "host": ["{{base_url}}"],
              "path": ["api", "driver"]
            }
          }
        }
      ]
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  }
}
```

**Cách import:**
1. Mở Postman
2. Click **"Import"**
3. Chọn file `Delivery_Management_API.postman_collection.json`
4. Click **"Import"**

---

## 📊 Tổng Hợp

| Category | Tests | Method |
|----------|-------|--------|
| **Authentication** | 3 | POST |
| **Driver Management** | 6 | GET, POST, PUT, DELETE |
| **Order Management** | 16 | GET, POST, PUT, DELETE |
| **Reports** | 4 | GET |
| **TOTAL** | **29** | |

---

## ✅ Kết Luận

- ✅ Postman giúp test API nhanh hơn PowerShell
- ✅ Environment variables tự động lưu token
- ✅ Test scripts tự động kiểm tra kết quả
- ✅ Collection có thể share với team
- ✅ Import/Export dễ dàng

