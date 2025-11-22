# 📚 BACKEND API SUMMARY - ERD v2

> **Tóm tắt các endpoint backend và hướng dẫn tích hợp frontend**

---

## 🔗 BASE URL

```
http://localhost:3000
```

---

## 🔐 AUTHENTICATION

### Flow đăng nhập:

1. **Client gửi login request** → Backend trả về JWT token
2. **Client lưu token** (localStorage hoặc sessionStorage)
3. **Mọi request sau đó** phải gửi kèm token trong header:
   ```
   Authorization: Bearer <token>
   ```

---

## 📋 DANH SÁCH ENDPOINTS (20 endpoints)

### 1️⃣ AUTHENTICATION (1 endpoint)

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/login` | ❌ | Đăng nhập, nhận JWT token |

**Request Body:**
```json
{
  "username": "sManager",
  "password": "Nhom6251"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2️⃣ DRIVER MANAGEMENT (5 endpoints)

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/driver` | ✅ | Lấy danh sách tài xế |
| GET | `/api/driver/:id` | ✅ | Lấy chi tiết tài xế |
| POST | `/api/driver` | ✅ | Tạo tài xế mới |
| PUT | `/api/driver/:id` | ✅ | Cập nhật tài xế |
| DELETE | `/api/driver/:id` | ✅ | Xóa tài xế |

**Sample Request Body (POST/PUT):**
```json
{
  "DriverID": "DRV001",
  "Ho_ten": "Nguyễn Văn A",
  "CCCD": "001234567890",
  "Rating": 4.5,
  "Trang_thai_hoat_dong": "Đang hoạt động"
}
```

---

### 3️⃣ ORDER MANAGEMENT (5 endpoints) - ERD v2

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/don-hang` | ✅ | Lấy danh sách đơn hàng (filter, sort, pagination) |
| GET | `/api/don-hang/:id` | ✅ | Lấy chi tiết đơn hàng |
| POST | `/api/don-hang` | ✅ | Tạo đơn hàng mới (auto calculate shipping) |
| PUT | `/api/don-hang/:id` | ✅ | Cập nhật đơn hàng (validate 11 statuses) |
| DELETE | `/api/don-hang/:id` | ✅ | Xóa đơn hàng |

#### 🎯 Query Parameters cho GET /api/don-hang:

```
?page=1&limit=10&trang_thai_don=Đang giao hàng&ma_khach_hang=KH001&sortKey=quang_duong&sortOrder=DESC
```

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| page | integer | 1 | Số trang |
| limit | integer | 10 | Số đơn mỗi trang |
| trang_thai_don | string | - | Lọc theo 11 trạng thái |
| ma_khach_hang | string | - | Lọc theo mã khách hàng |
| sortKey | string | thoi_gian_dat_don | Field để sort |
| sortOrder | string | DESC | ASC hoặc DESC |

#### 📊 11 Trạng Thái Đơn Hàng (ERD v2):

1. `Đang xử lý`
2. `Đang tìm tài xế`
3. `Đã tìm được tài xế`
4. `Đang lấy hàng`
5. `Lấy hàng thành công`
6. `Lấy hàng thất bại`
7. `Đang giao hàng`
8. `Giao hàng thành công`
9. `Giao hàng thất bại`
10. `Đã hoàn về kho`
11. `Đã hoàn thành`

#### 💰 Sample Request Body (POST) - Auto Calculate Shipping:

```json
{
  "Ma_khach_hang": "KH001",
  "dia_chi_lay_hang": "123 Nguyễn Văn Cừ, Q5, TP.HCM",
  "dia_chi_giao_hang": "456 Lê Lợi, Q1, TP.HCM",
  "SDT_nguoi_gui": "0901234567",
  "ten_nguoi_gui": "Nguyễn Văn A",
  "SDT_nguoi_nhan": "0907654321",
  "ten_nguoi_nhan": "Trần Thị B",
  "gia_tri_hang_hoa_phi_van_chuyen": 500000.00,
  "ghi_chu": "Giao hàng trong giờ hành chính"
}
```

**Backend tự động tính:**
- `quang_duong`: 10.5 km (sau này tích hợp Google Maps API)
- `phi_van_chuyen_goc`: quang_duong × 15000
- `so_tien_duoc_giam`: 0 (hoặc áp dụng mã khuyến mãi)
- `phi_van_chuyen_sau_giam`: phi_van_chuyen_goc - so_tien_duoc_giam
- `Ma_don_hang`: Auto-increment format DHxxxx (DH0001, DH0002...)
- `Trang_thai_don`: Mặc định "Đang xử lý"

---

### 4️⃣ DELIVERY TRIP MANAGEMENT (6 endpoints) - TÍNH NĂNG MỚI ERD v2

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/chuyen-giao-hang` | ✅ | Lấy danh sách chuyến giao hàng |
| GET | `/api/chuyen-giao-hang/:id` | ✅ | Lấy chi tiết chuyến + danh sách đơn |
| GET | `/api/chuyen-giao-hang/:id/total-distance` | ✅ | Tính tổng quãng đường chuyến |
| POST | `/api/chuyen-giao-hang` | ✅ | Tạo chuyến mới |
| POST | `/api/chuyen-giao-hang/:id/add-don-hang` | ✅ | Gộp đơn vào chuyến |
| PUT | `/api/chuyen-giao-hang/:id` | ✅ | Cập nhật trạng thái chuyến |

#### 🚚 Sample Request Body - Tạo chuyến mới:

```json
{
  "DriverID": "DRV001"
}
```

**Backend tự động:**
- `DeliveryID`: Auto-increment format CGHxxx (CGH001, CGH002...)
- `so_luong_don_gop`: 0 (ban đầu)
- `TrangThaiChuyen`: "Đang thực hiện"
- `tong_quang_duong_tinh_toan`: "0.00"

#### 📦 Sample Request Body - Gộp đơn vào chuyến:

```json
{
  "Ma_don_hang": "DH0001",
  "Thu_tu_lay_hang": 1,
  "Thu_tu_giao_hang": 1
}
```

**Backend:**
- Kiểm tra đơn hàng chưa có trong chuyến khác
- Tăng `so_luong_don_gop` của chuyến
- Tạo record trong `DON_HANG_DUOC_GIAO` (junction table)
- Tự động cập nhật trạng thái đơn hàng

---

### 5️⃣ REPORTS (2 endpoints)

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/bao-cao/top-tai-xe` | ✅ | Top tài xế theo rating |
| GET | `/api/bao-cao/top-khach-hang` | ✅ | Top khách hàng theo doanh thu |

#### 🏆 Query Parameters:

**Top Tài Xế:**
```
?topN=5&minStar=4.0
```

**Top Khách Hàng:**
```
?topN=10&startDate=2025-01-01&endDate=2025-12-31
```

---

## 🛠️ HƯỚNG DẪN TÍCH HỢP FRONTEND

### Bước 1: Setup Axios Instance

```javascript
// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

### Bước 2: Tạo API Service Functions

```javascript
// src/api/services.js
import axios from './axios';

// ========== AUTHENTICATION ==========
export const authAPI = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  logout: () => axios.post('/api/auth/logout')
};

// ========== DRIVERS ==========
export const driverAPI = {
  getAll: () => axios.get('/api/driver'),
  getById: (id) => axios.get(`/api/driver/${id}`),
  create: (data) => axios.post('/api/driver', data),
  update: (id, data) => axios.put(`/api/driver/${id}`, data),
  delete: (id) => axios.delete(`/api/driver/${id}`)
};

// ========== ORDERS (ERD v2) ==========
export const orderAPI = {
  getAll: (params) => axios.get('/api/don-hang', { params }),
  getById: (id) => axios.get(`/api/don-hang/${id}`),
  create: (data) => axios.post('/api/don-hang', data),
  update: (id, data) => axios.put(`/api/don-hang/${id}`, data),
  delete: (id) => axios.delete(`/api/don-hang/${id}`)
};

// ========== DELIVERY TRIPS (NEW ERD v2) ==========
export const deliveryAPI = {
  getAll: (params) => axios.get('/api/chuyen-giao-hang', { params }),
  getById: (id) => axios.get(`/api/chuyen-giao-hang/${id}`),
  getTotalDistance: (id) => axios.get(`/api/chuyen-giao-hang/${id}/total-distance`),
  create: (data) => axios.post('/api/chuyen-giao-hang', data),
  addOrder: (id, data) => axios.post(`/api/chuyen-giao-hang/${id}/add-don-hang`, data),
  updateStatus: (id, data) => axios.put(`/api/chuyen-giao-hang/${id}`, data)
};

// ========== REPORTS ==========
export const reportAPI = {
  topDrivers: (params) => axios.get('/api/bao-cao/top-tai-xe', { params }),
  topCustomers: (params) => axios.get('/api/bao-cao/top-khach-hang', { params })
};
```

---

### Bước 3: Sử dụng trong React Components

```jsx
// Example: LoginPage.jsx
import { useState } from 'react';
import { authAPI } from '../api/services';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Đăng nhập thất bại: ' + error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="text" 
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

---

## 📝 RESPONSE FORMAT CHUẨN

### ✅ Success Response:

```json
{
  "success": true,
  "message": "Thành công",
  "data": { /* ... */ },
  "pagination": { /* chỉ có với list endpoints */ }
}
```

### ❌ Error Response:

```json
{
  "success": false,
  "message": "Lỗi mô tả",
  "error": "Chi tiết lỗi kỹ thuật"
}
```

### 📄 Pagination Format:

```json
{
  "pagination": {
    "total": 100,
    "totalPages": 10,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🔥 TIPS QUAN TRỌNG

### 1. Token Management
- ✅ Lưu token vào `localStorage` hoặc `sessionStorage`
- ✅ Gửi kèm header: `Authorization: Bearer <token>`
- ✅ Token expire sau 1 giờ → Handle 401 error để redirect login

### 2. Error Handling
```javascript
try {
  const response = await orderAPI.getAll();
} catch (error) {
  if (error.response) {
    // Server trả về lỗi (4xx, 5xx)
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    // Request đã gửi nhưng không nhận được response
    console.error('No response from server');
  } else {
    // Lỗi khi setup request
    console.error('Error:', error.message);
  }
}
```

### 3. Pagination Best Practice
```javascript
// Component state
const [orders, setOrders] = useState([]);
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1
});

// Fetch data
const fetchOrders = async (page = 1) => {
  const response = await orderAPI.getAll({ page, limit: 10 });
  setOrders(response.data.data);
  setPagination(response.data.pagination);
};
```

### 4. Filter & Sort
```javascript
const params = {
  page: 1,
  limit: 10,
  trang_thai_don: 'Đang giao hàng',
  ma_khach_hang: 'KH001',
  sortKey: 'quang_duong',
  sortOrder: 'DESC'
};

const response = await orderAPI.getAll(params);
```

---

## 🎯 CHECKLIST TÍCH HỢP

- [ ] Setup Axios instance với baseURL
- [ ] Implement token interceptor
- [ ] Handle 401 Unauthorized
- [ ] Create API service functions cho 5 nhóm endpoint
- [ ] Test login flow
- [ ] Test CRUD operations cho Orders
- [ ] Test Delivery Trip Management (NEW)
- [ ] Implement pagination UI
- [ ] Implement filter/sort UI
- [ ] Test error handling
- [ ] Test token expiration

---

**🔗 Xem chi tiết:** `FRONTEND_IMPLEMENTATION.md` để có code mẫu đầy đủ cho từng feature!

---

**📅 Updated:** November 22, 2025  
