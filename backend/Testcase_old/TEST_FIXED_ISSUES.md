# 🧪 TEST FIXED ISSUES - Swagger UI Guide

## 📋 2 Issues đã fix:
1. **Lọc chuyến giao hàng** - trả empty array khi không có kết quả
2. **Top khách hàng** - sort thêm theo số đơn hàng khi doanh thu bằng nhau

---

## 🧪 TEST TRÊN SWAGGER UI

**Mở Swagger:** http://localhost:3000/api-docs

---

### ✅ TEST 1: Filter không có kết quả

**Endpoint:** `GET /api/chuyen-giao-hang`

**Parameters:**
```
trang_thai: Không tồn tại
```

**✅ Expected:**
```json
{
  "success": true,
  "message": "Không tìm thấy chuyến giao hàng phù hợp với bộ lọc",
  "pagination": { "total": 0, "totalPages": 0 },
  "data": []
}
```

**Check:** `data` là array rỗng `[]`, `total = 0`

---

### ✅ TEST 2a: Filter "Đang thực hiện"

**Endpoint:** `GET /api/chuyen-giao-hang`

**Parameters:**
```
trang_thai: Đang thực hiện
```

**✅ Expected:**
```json
{
  "success": true,
  "data": [
    { "DeliveryID": "CGH001", "TrangThaiChuyen": "Đang thực hiện" },
    { "DeliveryID": "CGH002", "TrangThaiChuyen": "Đang thực hiện" }
  ]
}
```

**Check:** Chỉ 2 records, tất cả có `TrangThaiChuyen = "Đang thực hiện"`

---

### ✅ TEST 2b: Filter "Hoàn thành"

**Parameters:**
```
trang_thai: Hoàn thành
```

**✅ Expected:** 2 records (CGH004, CGH005), tất cả có trạng thái "Hoàn thành"

---

### ✅ TEST 2c: Filter "Đã hủy"

**Parameters:**
```
trang_thai: Đã hủy
```

**✅ Expected:** 1 record (CGH003), trạng thái "Đã hủy"

---

### ✅ TEST 2d: Không filter (chọn -- hoặc để trống)

**Parameters:**
```
(không điền gì hoặc chọn --)
```

**✅ Expected:** Trả về TẤT CẢ 5 chuyến, có cả 3 trạng thái khác nhau

---

### ✅ TEST 3: Top khách hàng - Top 3

**Endpoint:** `GET /api/bao-cao/top-khach-hang`

**Parameters:**
```
topN: 3
```

**✅ Expected:**
```json
{
  "success": true,
  "data": [
    { "Ma_khach_hang": "...", "total_revenue": 1000000, "so_don_hang": 5 },
    { "Ma_khach_hang": "...", "total_revenue": 1000000, "so_don_hang": 3 },
    { "Ma_khach_hang": "...", "total_revenue": 900000, "so_don_hang": 2 }
  ],
  "summary": { "totalFound": 3 }
}
```

**Check:** 
- Đúng 3 records
- Nếu `total_revenue` bằng nhau → `so_don_hang` cao hơn đứng trước

---


## 🧹 RESET DATABASE

**Chạy từ thư mục backend:**

```powershell
sqlcmd -S localhost -U sManager -P Nhom6251 -d QuanLyGiaoHang_Nhom06 -i RESET_TEST_DATA.sql
```

