# 🧪 HƯỚNG DẪN TEST STORED PROCEDURE API

## 📋 Tóm tắt cập nhật

### ✅ Nhiệm vụ 1: Fix lỗi sinh mã đơn hàng
**Vấn đề:** Mã đơn hàng sinh ra là `DH0011`, `DH0012` thay vì `DH011`, `DH012`

---

### ✅ Nhiệm vụ 2: Tích hợp Stored Procedure sp_TaoDonHang

**Endpoint mới:** `POST /api/bao-cao/tao-don-hang-sp`

**Vị trí:** Phần thứ 3 của Reports (sau top-tai-xe và top-khach-hang)

**Stored Procedure:** `sp_TaoDonHang`

---

## 🔧 CHI TIẾT API MỚI

### Endpoint
```
POST /api/bao-cao/tao-don-hang-sp
```

**Request Body (Frontend gửi 8 params)**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Nguyen Van Test",
  "dia_chi_lay_hang": "123 Le Loi, Q1, TPHCM",
  "dia_chi_giao_hang": "456 Nguyen Hue, Q3, TPHCM",
  "can_nang": 2.5,
  "gia_tri_hang_hoa": 150000,
  "phuong_thuc_giao_hang": "Giao nhanh"
}
```

### Backend tự tính 2 params:
1. **PhiVanChuyen:**
   - Giả định quãng đường: 5km
   - Đơn giá: 15,000 VND/km
   - Công thức: `5 * 15,000 = 75,000 VND`

2. **ThoiGianGiaoDuKien:**
   - Thời gian hiện tại + 3 ngày
   - Ví dụ: Nếu hôm nay là 2025-11-25, thì dự kiến giao: 2025-11-28

### Response (201 Created)
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công bằng stored procedure",
  "data": {
    "Ma_don_hang": "DH011",
    "Trang_thai_don": "Đang xử lý",
    "phi_van_chuyen": 75000,
    "thoi_gian_giao_du_kien": "2025-11-28T14:30:00.000Z",
    "quang_duong_gia_dinh": 5
  },
  "calculatedParams": {
    "phiVanChuyen": 75000,
    "thoiGianGiaoDuKien": "2025-11-28T14:30:00.000Z",
    "quangDuongGiaDinh": 5
  }
}
```

---

## 🧪 TEST CASES

### ✅ TC-SP-01: Tạo đơn hàng thành công

**Endpoint:** `POST /api/bao-cao/tao-don-hang-sp`

**Request Body:**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Nguyen Van Test",
  "dia_chi_lay_hang": "123 Le Loi, Q1, TPHCM",
  "dia_chi_giao_hang": "456 Nguyen Hue, Q3, TPHCM",
  "can_nang": 2.5,
  "gia_tri_hang_hoa": 150000,
  "phuong_thuc_giao_hang": "Giao nhanh"
}
```

**Expected Response (201):**
- `Ma_don_hang`: Format `DH011`, `DH012`, ... (3 chữ số)
- `phi_van_chuyen`: 75000 (5km * 15,000)
- `thoi_gian_giao_du_kien`: Hiện tại + 3 ngày

---

### ❌ TC-SP-02: Thiếu thông tin bắt buộc

**Request Body:**
```json
{
  "Ma_khach_hang": "KH1",
  "SDT_nguoi_nhan": "0901234567"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Thiếu thông tin bắt buộc"
}
```

---

### ❌ TC-SP-03: Khách hàng không tồn tại

**Request Body:**
```json
{
  "Ma_khach_hang": "KH999",
  "SDT_nguoi_nhan": "0901234567",
  "ten_nguoi_nhan": "Test User",
  "dia_chi_lay_hang": "Address 1",
  "dia_chi_giao_hang": "Address 2",
  "can_nang": 1.0,
  "gia_tri_hang_hoa": 100000,
  "phuong_thuc_giao_hang": "Giao nhanh"
}
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Khách hàng không tồn tại"
}
```

---

### ✅ TC-SP-04: Kiểm tra mã đơn tăng dần

**Bước 1:** Tạo đơn hàng lần 1
- Request: TC-SP-01
- Response: `Ma_don_hang = "DH011"` (hoặc số tiếp theo)

**Bước 2:** Tạo đơn hàng lần 2
- Request: TC-SP-01 (cùng body)
- Response: `Ma_don_hang = "DH012"` (số tiếp theo)

**Kỳ vọng:** Mã đơn hàng tăng dần: `DH011` → `DH012` → `DH013`

---

