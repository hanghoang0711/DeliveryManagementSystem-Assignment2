# TEST STORED PROCEDURES - SWAGGER UI

**Hướng dẫn**: Copy request body → Paste vào Swagger UI → Click "Execute" → So sánh kết quả

**Lưu ý**: Phải đăng nhập trước ở `/api/auth/login` để lấy JWT token

---

## 🔐 BƯỚC 1: ĐĂNG NHẬP

### POST /api/auth/login

**Request Body**:
```json
{
  "username": "sManager",
  "password": "Nhom6251"
}
```

**Expected**: 
- Status: `200`
- Response có `token`
- Copy token → Click "Authorize" ở góc phải Swagger UI → Paste token

---

## 📦 BƯỚC 2: TEST CÁC STORED PROCEDURES

### 1. SP_THEMNHANVIEN - Tạo nhân viên (Mã NVxxx)

**Endpoint**: `POST /api/sp/nhanvien`

**Request Body**:
```json
{
  "Ho_va_ten_lot": "Nguyen Van",
  "Ten": "Test",
  "Gioi_tinh": "Nam",
  "Ngay_sinh": "1995-03-20",
  "Dia_chi": "456 Nguyen Hue, Q1, TPHCM",
  "SDT": "0901112233",
  "email": "nvtest@example.com",
  "CCCD": "079095012345",
  "Ngay_bat_dau_lam": "2024-11-01",
  "Vai_tro": "Nhân viên quản lý"
}
```

**Expected**: 
- Status: `201`
- Response:
```json
{
  "success": true,
  "message": "Tạo nhân viên thành công",
  "data": {
    "Ma_nhan_vien": "NV001" (hoặc NV002, NV003...),
    "Ten": "Test",
    "Vai_tro": "Nhân viên quản lý"
  }
}
```

---

### 2. SP_DANGKYKHACHHANG - Đăng ký khách hàng cá nhân (Mã KHxxx)

**Endpoint**: `POST /api/sp/khachhang`

**Request Body**:
```json
{
  "email": "khtest@example.com",
  "Ho_va_ten_lot": "Le Thi",
  "Ten": "Lan",
  "Loai_khach_hang": "CANHAN"
}
```

**Expected**: 
- Status: `201`
- Response:
```json
{
  "success": true,
  "message": "Đăng ký khách hàng thành công",
  "data": {
    "Ma_khach_hang": "KH001" (hoặc KH002...),
    "email": "khtest@example.com",
    "Loai_khach_hang": "CANHAN"
  }
}
```

---

### 3. SP_DANGKYKHACHHANG - Đăng ký khách hàng doanh nghiệp

**Request Body**:
```json
{
  "email": "doanhnghiep@example.com",
  "Ten_doanh_nghiep": "Cong ty TNHH Test",
  "Ma_so_thue": "0123456789",
  "Loai_khach_hang": "DOANHNGHIEP"
}
```

**Expected**: 
- Status: `201`
- Data có `Ma_khach_hang`, `Loai_khach_hang: "DOANHNGHIEP"`

---

### 4. SP_THEMTAIXE - Thêm tài xế (Mã DRVxxx)

**Endpoint**: `POST /api/driver` (đã cập nhật sử dụng SP)

**Request Body**:
```json
{
  "Ho_ten": "Pham Van Tai Xe Test",
  "CCCD": "001234567890",
  "Gioi_Tinh": "Nam",
  "Ngay_Sinh": "1988-07-15",
  "Ngay_Bat_Dau_Lam_Viec": "2024-11-01",
  "Ma_Nhan_Vien_quan_li": "NV002"
}
```

**Expected**: 
- Status: `201`
- Message: "Tài xế tạo thành công (sử dụng sp_ThemTaiXe)"
- Data có `DriverID: "DRV001"` (hoặc DRV002...), `Trang_Thai: "Sẵn sàng"`

---

### 5. SP_TAOCHUYEN - Tạo chuyến giao hàng (Mã CGHxxx)

**Endpoint**: `POST /api/chuyen-giao-hang` (đã cập nhật sử dụng SP)

**Request Body**:
```json
{
  "DriverID": "DRV001"
}
```

**Expected**: 
- Status: `201`
- Message: "Tạo chuyến giao hàng thành công (sử dụng sp_TaoChuyenGiaoHang)"
- Data có `DeliveryID: "CGH001"` (hoặc CGH002...)

---

### 6. SP_TAODANHGIA - Tạo đánh giá (Mã DGxxx)

**Endpoint**: `POST /api/sp/danhgia`

**Lưu ý**: Cần có đơn hàng và khách hàng tồn tại trước

**Request Body**:
```json
{
  "Ma_khach_hang": "KH001",
  "Ma_don_hang": "DH001",
  "Rating": 5,
  "Comment": "Dịch vụ tuyệt vời, giao hàng đúng giờ",
  "DriverID": "DRV001"
}
```

**Expected**: 
- Status: `201`
- Response:
```json
{
  "success": true,
  "message": "Tạo đánh giá thành công",
  "data": {
    "Review_ID": "DG001",
    "Rating": 5,
    "Ma_don_hang": "DH001"
  }
}
```

---

### 7. SP_TAOYEUCAUHOTRO - Tạo yêu cầu hỗ trợ (Mã YCxxx)

**Endpoint**: `POST /api/sp/yeucauhotro`

**Request Body**:
```json
{
  "Ma_khach_hang": "KH001",
  "Loai_van_de": "Khiếu nại đơn hàng",
  "Noi_dung": "Đơn hàng DH001 bị giao trễ 2 ngày, yêu cầu kiểm tra và hoàn tiền phí ship"
}
```

**Expected**: 
- Status: `201`
- Data có `Ma_yeu_cau: "YC001"`, `Trang_thai: "Chờ xử lý"`

---

### 8. SP_TAOTHANHTOAN - Tạo thanh toán (Mã TTxxx)

**Endpoint**: `POST /api/sp/thanhtoan`

**Request Body**:
```json
{
  "Ma_khach_hang": "KH001",
  "phuong_thuc": "Chuyển khoản",
  "so_tien": 150000,
  "trang_thai": "Thành công"
}
```

**Expected**: 
- Status: `201`
- Data có `Ma_thanh_toan: "TT001"`, `so_tien: 150000`

---

### 9. SP_THEMXE - Thêm xe máy (Mã VHCxxx)

**Endpoint**: `POST /api/sp/xe`

**Request Body (Xe máy)**:
```json
{
  "Bien_so": "51F-12345",
  "Chu_so_huu": "Nguyen Van A",
  "Nam_san_xuat": "2020",
  "Tinh_trang": "Sẵn sàng",
  "Loai_xe": "XEMAY",
  "Phan_khoi": 125,
  "Khoang_cho": 0.3
}
```

**Expected**: 
- Status: `201`
- Data có `VehicleID: "VHC001"`, `Loai_xe: "XEMAY"`

---

### 10. SP_THEMXE - Thêm xe tải

**Request Body (Xe tải)**:
```json
{
  "Bien_so": "51C-67890",
  "Chu_so_huu": "Tran Van B",
  "Nam_san_xuat": "2019",
  "Tinh_trang": "Sẵn sàng",
  "Loai_xe": "XETAI",
  "Trong_tai": 1000,
  "Loai_thung": "Thùng kín"
}
```

**Expected**: 
- Status: `201`
- Data có `VehicleID: "VHC002"`, `Loai_xe: "XETAI"`

---

### 11. SP_TAODOHANG - Tạo đơn hàng (Mã DHxxx)

**Endpoint**: `POST /api/don-hang` (đã cập nhật sử dụng SP)

**Request Body**:
```json
{
  "Ma_khach_hang": "KH001",
  "SDT_nguoi_nhan": "0909876543",
  "ten_nguoi_nhan": "Nguyen Van Test",
  "dia_chi_lay_hang": "123 Le Loi, Q1, TPHCM",
  "dia_chi_giao_hang": "456 Nguyen Hue, Q3, TPHCM",
  "can_nang": 2.5,
  "gia_tri_hang_hoa_phi_van_chuyen": 200000,
  "phuong_thuc_giao_hang": "Giao nhanh",
  "Thoi_gian_giao_hang_du_kien": "2025-12-01T14:00:00"
}
```

**Expected**: 
- Status: `201`
- Message: "Tạo đơn hàng thành công (sử dụng sp_TaoDonHang)"
- Data có `Ma_don_hang: "DH001"` (hoặc DH002...), `Trang_thai_don: "Đang xử lý"`

---

## ⚠️ LƯU Ý KHI TEST

1. **Thứ tự test**:
   - Đăng nhập → Tạo nhân viên → Tạo khách hàng → Tạo tài xế → Tạo đơn hàng → Tạo chuyến giao → Tạo đánh giá

2. **Foreign key constraints**:
   - Tạo nhân viên trước khi tạo tài xế (cần `Ma_Nhan_Vien_quan_li`)
   - Tạo khách hàng trước khi tạo đơn hàng
   - Tạo tài xế trước khi tạo chuyến giao
   - Tạo đơn hàng trước khi tạo đánh giá

3. **Mã tự động**:
   - Tất cả các SP đều tự động sinh mã
   - Format: PREFIX + 3 chữ số (DH001, NV001, DRV001...)
   - Mã tăng dần: DH001 → DH002 → DH003...

4. **Error thường gặp**:
   - **401 Unauthorized**: Chưa đăng nhập hoặc token hết hạn → Login lại
   - **404 Not Found**: Foreign key không tồn tại (VD: Ma_khach_hang = "KH999")
   - **400 Bad Request**: Thiếu field bắt buộc hoặc sai định dạng

---

## 📊 KIỂM TRA KẾT QUẢ

Sau khi test, kiểm tra database:

```sql
-- Kiểm tra các mã đã sinh
SELECT 'NHANVIEN' AS Bang, Ma_nhan_vien AS Ma FROM NHANVIEN
UNION ALL
SELECT 'KHACH_HANG', Ma_khach_hang FROM KHACH_HANG
UNION ALL
SELECT 'TAI_XE', DriverID FROM TAI_XE
UNION ALL
SELECT 'DON_HANG', Ma_don_hang FROM DON_HANG
UNION ALL
SELECT 'CHUYEN_GIAO', DeliveryID FROM CHUYEN_GIAO_HANG
UNION ALL
SELECT 'DANH_GIA', Review_ID FROM DANH_GIA_CUA_KHACH_HANG
UNION ALL
SELECT 'YEU_CAU', Ma_yeu_cau FROM YEU_CAU_HO_TRO
UNION ALL
SELECT 'THANH_TOAN', Ma_thanh_toan FROM THANH_TOAN
UNION ALL
SELECT 'XE', VehicleID FROM XE
ORDER BY Bang, Ma;
```

**Expected**: Tất cả mã đều có format đúng (PREFIX + 3 chữ số)
