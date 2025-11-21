# 🧪 HƯỚNG DẪN TEST

## 📋 Mục Lục
1. [Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
2. [Test Authentication](#2-test-authentication)
3. [Test Driver Management ](#3-test-driver-management)
4. [Test Order Management - GET](#4-test-order-management---get)
5. [Test Order Management - CREATE](#5-test-order-management---create)
6. [Test Order Management - UPDATE](#6-test-order-management---update)
7. [Test Order Management - DELETE](#7-test-order-management---delete)
8. [Test Reports](#8-test-reports)
9. [Tổng hợp kết quả](#9-tổng-hợp-kết-quả)

---

## 1. Chuẩn bị môi trường

### ✅ Bước 1.1: Start Server
Mở **Terminal 1** (PowerShell) và chạy:
```powershell
cd D:\HK251\Database\BTL2\PART3\backend
node server.js
```

**Expected Output:**
```
✅ Kết nối database thành công!
✅ Database đã kết nối thành công!
🚀 Server chạy trên port 3000
📍 Auth: http://localhost:3000/api/auth/login
📍 Driver: http://localhost:3000/api/driver
📍 Orders: http://localhost:3000/api/don-hang
📍 Reports: http://localhost:3000/api/bao-cao
```

⚠️ **Lưu ý:** Giữ terminal này chạy, không được tắt!

### ✅ Bước 1.2: Mở Terminal Test
Mở **Terminal 2** (PowerShell mới) để test API:
```powershell
cd D:\HK251\Database\BTL2\PART3\backend
```

---

## 2. Test Authentication

### ✅ Test 2.1: Login thành công (Person 2's auth)
```powershell
$body = @{
    username = 'sManager'
    password = 'Nhom6251'
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

# Lưu token vào biến global
$global:token = $loginResponse.token

Write-Host "✅ Login Success" -ForegroundColor Green
Write-Host "Token: $($global:token.Substring(0,30))..."
Write-Host "Message: $($loginResponse.message)"
```

**Expected Result:**
- ✅ Status 200
- ✅ Nhận được token
- ✅ Message: "Đăng nhập thành công!"

---

### ❌ Test 2.2: Login thất bại (sai password)
```powershell
$body = @{
    username = 'sManager'
    password = 'wrongpassword'
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "❌ FAILED: Should not login with wrong password" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Login rejected with wrong password" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 401
- ✅ Message: "Sai thông tin đăng nhập!"

---

### ❌ Test 2.3: Login thất bại (user không tồn tại)
```powershell
$body = @{
    username = 'nonexistuser'
    password = 'anypassword'
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "❌ FAILED: Should not login with non-exist user" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Login rejected for non-exist user" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 401
- ✅ Message: "Sai thông tin đăng nhập!"

---

## 3. Test Driver Management 

### ⚙️ Setup: Tạo headers cho các request
```powershell
$headers = @{
    Authorization = "Bearer $global:token"
    "Content-Type" = "application/json"
}
```

---

### ✅ Test 3.1: GET tất cả tài xế
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/driver" -Method Get -Headers $headers
    Write-Host "✅ GET All Drivers Success!" -ForegroundColor Green
    Write-Host "Total Drivers: $($response.data.Count)"
    if ($response.data.Count -gt 0) {
        Write-Host "`nFirst 3 drivers:"
        $response.data | Select-Object -First 3 | Format-Table DriverID, Ho_ten, CCCD, Rating
    } else {
        Write-Host "⚠️ No drivers in database yet" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ GET Drivers Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
    Write-Host "(This is OK if database has no drivers yet)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Có danh sách tài xế (hoặc mảng rỗng nếu chưa có data)
- ✅ Include: TaiXeXeMay, TaiXeXeTai, TaiXeSDT, GhiChuQuanLyTaiXe, NhanVienQuanLyTaiXe

---

### ✅ Test 3.2: GET tài xế by ID (nếu có data)
```powershell
# Skip nếu không có driver
$allDrivers = Invoke-RestMethod -Uri "http://localhost:3000/api/driver" -Method Get -Headers $headers
if ($allDrivers.data.Count -gt 0) {
    $firstDriverId = $allDrivers.data[0].DriverID
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/driver/$firstDriverId" -Method Get -Headers $headers
        Write-Host "✅ GET Driver by ID Success!" -ForegroundColor Green
        Write-Host "Driver ID: $($response.data.DriverID)"
        Write-Host "Name: $($response.data.Ho_ten)"
        Write-Host "Rating: $($response.data.Rating)"
    } catch {
        Write-Host "❌ GET Driver by ID Failed" -ForegroundColor Red
        Write-Host "Error: $($_.ErrorDetails.Message)"
    }
} else {
    Write-Host "⚠️ Skipped - No drivers in database" -ForegroundColor Yellow
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Có đầy đủ thông tin driver
- ✅ Include: TaiXeXeMay/TaiXeXeTai, TaiXeSDT, NhanVienQuanLyTaiXe

---

### ❌ Test 3.3: GET driver không tồn tại
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/driver/DRV9999" -Method Get -Headers $headers
    Write-Host "❌ FAILED: Should return 404" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Driver not found (404)" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 404
- ✅ Message: "Không tìm thấy tài xế"

---

### ✅ Test 3.4: CREATE tài xế mới (motorbike driver)
```powershell
$newDriver = @{
    DriverID = "DRV0TEST"
    Ho_ten = "Nguyen Van Test Driver"
    CCCD = "123456789999"
    Gioi_Tinh = "Nam"
    Ngay_Sinh = "1990-01-01"
    Ngay_Bat_Dau_Lam_Viec = "2020-01-01"
    Rating = 5.0
    Ma_Nhan_Vien_quan_li = "NV0002"
    Trang_Thai = "Sẵn sàng"
    Ngay_Bat_Dau_Quan_Ly = "2020-01-01"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/driver" -Method Post -Headers $headers -Body $newDriver
    Write-Host "✅ CREATE Driver Success!" -ForegroundColor Green
    Write-Host "New Driver ID: $($response.data.DriverID)"
    Write-Host "Name: $($response.data.Ho_ten)"
    $global:testDriverId = $response.data.DriverID
} catch {
    Write-Host "⚠️ CREATE Driver Failed:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
    Write-Host "(This might fail if FK constraint or duplicate CCCD)"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Driver được tạo thành công
- ✅ DriverID = "DRV0TEST"

---

### ✅ Test 3.5: UPDATE tài xế
```powershell
if ($global:testDriverId) {
    $updateData = @{
        Ho_ten = "Nguyen Van Test UPDATED"
        Rating = 4.8
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/driver/$global:testDriverId" -Method Put -Headers $headers -Body $updateData
        Write-Host "✅ UPDATE Driver Success!" -ForegroundColor Green
        Write-Host "Updated Name: $($response.data.Ho_ten)"
        Write-Host "Updated Rating: $($response.data.Rating)"
    } catch {
        Write-Host "❌ UPDATE Driver Failed" -ForegroundColor Red
        Write-Host "Error: $($_.ErrorDetails.Message)"
    }
} else {
    Write-Host "⚠️ Skipped - No test driver created" -ForegroundColor Yellow
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Ho_ten = "Nguyen Van Test UPDATED"
- ✅ Rating = 4.8

---

### ✅ Test 3.6: DELETE tài xế (cleanup)
```powershell
if ($global:testDriverId) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/driver/$global:testDriverId" -Method Delete -Headers $headers
        Write-Host "✅ DELETE Driver Success!" -ForegroundColor Green
        Write-Host "Message: $($response.message)"
    } catch {
        Write-Host "⚠️ DELETE Driver Failed:" -ForegroundColor Yellow
        Write-Host "Error: $($_.ErrorDetails.Message)"
        Write-Host "(This might fail if driver has dependencies)"
    }
} else {
    Write-Host "⚠️ Skipped - No test driver to delete" -ForegroundColor Yellow
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Message: "Xóa tài xế thành công"

---

## 4. Test Order Management - GET

### ✅ Test 4.1: GET tất cả đơn hàng (không filter)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang" -Method Get -Headers $headers
    Write-Host "✅ GET All Orders Success!" -ForegroundColor Green
    Write-Host "Total Orders: $($response.pagination.totalOrders)"
    Write-Host "Total Pages: $($response.pagination.totalPages)"
    Write-Host "Current Page: $($response.pagination.currentPage)"
    if ($response.data.Count -gt 0) {
        Write-Host "`nFirst 3 orders:"
        $response.data | Select-Object -First 3 | Format-Table Ma_don_hang, Trang_thai_don, gia_tri_hang_hoa_phi_van_chuyen
    }
} catch {
    Write-Host "❌ GET Orders Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Có danh sách đơn hàng (6-10 orders)
- ✅ Có pagination info: totalOrders, totalPages, currentPage, hasNextPage, hasPrevPage

---

### ✅ Test 4.2: Filter theo trạng thái đơn hàng
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang?trang_thai_don=Đã tạo" -Method Get -Headers $headers
    Write-Host "✅ Filter Orders by Status Success!" -ForegroundColor Green
    Write-Host "Orders with status 'Đã tạo': $($response.pagination.totalOrders)"
    $response.data | Format-Table Ma_don_hang, Trang_thai_don
} catch {
    Write-Host "❌ Filter Orders Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Chỉ trả về orders có trạng thái "Đã tạo"
- ✅ Total count đúng với số lượng filter

---

### ✅ Test 4.3: Filter theo mã khách hàng
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang?ma_khach_hang=KH1" -Method Get -Headers $headers
    Write-Host "✅ Filter Orders by Customer Success!" -ForegroundColor Green
    Write-Host "Orders of customer KH1: $($response.pagination.totalOrders)"
    $response.data | Format-Table Ma_don_hang, Ma_khach_hang
} catch {
    Write-Host "❌ Filter by Customer Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Tất cả orders đều có Ma_khach_hang = "KH1"

---

### ✅ Test 4.4: Sort theo giá trị hàng hóa (ASC)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang?sortKey=gia_tri_hang_hoa_phi_van_chuyen&sortOrder=ASC" -Method Get -Headers $headers
    Write-Host "✅ Sort Orders by Price (ASC) Success!" -ForegroundColor Green
    Write-Host "Orders sorted by price (low to high):"
    $response.data | Select-Object -First 5 | Format-Table Ma_don_hang, gia_tri_hang_hoa_phi_van_chuyen
} catch {
    Write-Host "❌ Sort Orders Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Orders được sắp xếp từ giá thấp đến cao

---

### ✅ Test 4.5: Sort theo giá trị hàng hóa (DESC)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang?sortKey=gia_tri_hang_hoa_phi_van_chuyen&sortOrder=DESC" -Method Get -Headers $headers
    Write-Host "✅ Sort Orders by Price (DESC) Success!" -ForegroundColor Green
    Write-Host "Orders sorted by price (high to low):"
    $response.data | Select-Object -First 5 | Format-Table Ma_don_hang, gia_tri_hang_hoa_phi_van_chuyen
} catch {
    Write-Host "❌ Sort Orders Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Orders được sắp xếp từ giá cao đến thấp

---

### ✅ Test 4.6: Pagination - Page 1 (limit=2)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang?page=1&limit=2" -Method Get -Headers $headers
    Write-Host "✅ Pagination Page 1 Success!" -ForegroundColor Green
    Write-Host "Current Page: $($response.pagination.currentPage)"
    Write-Host "Has Next Page: $($response.pagination.hasNextPage)"
    Write-Host "Has Prev Page: $($response.pagination.hasPrevPage)"
    $response.data | Format-Table Ma_don_hang
} catch {
    Write-Host "❌ Pagination Failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Chỉ có 2 orders
- ✅ currentPage = 1
- ✅ hasNextPage = true
- ✅ hasPrevPage = false

---

### ✅ Test 4.7: GET order by ID
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/DH001" -Method Get -Headers $headers
    Write-Host "✅ GET Order by ID Success!" -ForegroundColor Green
    Write-Host "Ma_don_hang: $($response.data.Ma_don_hang)"
    Write-Host "Trang_thai_don: $($response.data.Trang_thai_don)"
    Write-Host "Gia tri: $($response.data.gia_tri_hang_hoa_phi_van_chuyen)"
    if ($response.data.khachHang) {
        Write-Host "Customer: $($response.data.khachHang.email)"
    }
} catch {
    Write-Host "⚠️ GET Order by ID Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
    Write-Host "(Order DH001 might not exist yet)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Có đầy đủ thông tin order
- ✅ Có thông tin khachHang (email, Ten_hang)

---

### ❌ Test 4.8: GET order không tồn tại
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/DH9999" -Method Get -Headers $headers
    Write-Host "❌ FAILED: Should return 404" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Order not found (404)" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 404
- ✅ Message: "Không tìm thấy đơn hàng với mã DH9999"

---

## 5. Test Order Management - CREATE

### ✅ Test 5.1: CREATE order hợp lệ (đầy đủ thông tin)
```powershell
$newOrder = @{
    Ma_khach_hang = 'KH1'
    SDT_nguoi_nhan = '0912345678'
    ten_nguoi_nhan = 'Nguyen Van Test Order'
    dia_chi_lay_hang = '123 Test Street, District 1, HCMC'
    dia_chi_giao_hang = '456 Delivery Street, District 3, HCMC'
    can_nang = 2.5
    gia_tri_hang_hoa_phi_van_chuyen = 250000
    phuong_thuc_giao_hang = 'Nhanh'
    Thoi_gian_giao_hang_du_kien = '2025-12-31T14:00:00'
    Thoi_gian_lay_hang_du_kien = '2025-12-30T10:00:00'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang" -Method Post -Headers $headers -Body $newOrder
    Write-Host "✅ CREATE Order Success!" -ForegroundColor Green
    Write-Host "New Order ID: $($response.data.Ma_don_hang)"
    Write-Host "Status: $($response.data.Trang_thai_don)"
    Write-Host "Customer: $($response.data.Ma_khach_hang)"
    $global:testOrderId = $response.data.Ma_don_hang
} catch {
    Write-Host "⚠️ CREATE Order Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
    Write-Host "(This might fail if customer KH1 doesn't exist)"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Ma_don_hang auto-generated (e.g., DH0011)
- ✅ Trang_thai_don = "Đã tạo"
- ✅ thoi_gian_dat_don = current datetime

---

### ❌ Test 5.2: CREATE order thiếu trường bắt buộc
```powershell
$invalidOrder = @{
    SDT_nguoi_nhan = '0912345678'
    ten_nguoi_nhan = 'Test User'
    dia_chi_lay_hang = '123 Test'
    dia_chi_giao_hang = '456 Delivery'
    can_nang = 2.5
    gia_tri_hang_hoa_phi_van_chuyen = 250000
    phuong_thuc_giao_hang = 'Nhanh'
    Thoi_gian_giao_hang_du_kien = '2025-12-31T14:00:00'
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang" -Method Post -Headers $headers -Body $invalidOrder
    Write-Host "❌ FAILED: Should reject missing Ma_khach_hang" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Missing Ma_khach_hang rejected" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 400
- ✅ Message: "Thiếu thông tin bắt buộc"

---

### ❌ Test 5.3: CREATE order với khách hàng không tồn tại
```powershell
$invalidCustomerOrder = @{
    Ma_khach_hang = 'KH9999'
    SDT_nguoi_nhan = '0912345678'
    ten_nguoi_nhan = 'Test User'
    dia_chi_lay_hang = '123 Test'
    dia_chi_giao_hang = '456 Delivery'
    can_nang = 2.5
    gia_tri_hang_hoa_phi_van_chuyen = 250000
    phuong_thuc_giao_hang = 'Nhanh'
    Thoi_gian_giao_hang_du_kien = '2025-12-31T14:00:00'
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang" -Method Post -Headers $headers -Body $invalidCustomerOrder
    Write-Host "❌ FAILED: Should reject non-exist customer" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Non-exist customer rejected" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 404
- ✅ Message: "Khách hàng không tồn tại"

---

## 6. Test Order Management - UPDATE

### ✅ Test 6.1: UPDATE trạng thái đơn hàng
```powershell
if ($global:testOrderId) {
    $updateData = @{
        Trang_thai_don = 'Đang xử lý'
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/$global:testOrderId" -Method Put -Headers $headers -Body $updateData
        Write-Host "✅ UPDATE Order Status Success!" -ForegroundColor Green
        Write-Host "Order: $($response.data.Ma_don_hang)"
        Write-Host "New Status: $($response.data.Trang_thai_don)"
    } catch {
        Write-Host "❌ UPDATE Order Failed" -ForegroundColor Red
        Write-Host "Error: $($_.ErrorDetails.Message)"
    }
} else {
    Write-Host "⚠️ Skipped - No test order created" -ForegroundColor Yellow
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Trang_thai_don = "Đang xử lý"

---

### ✅ Test 6.2: UPDATE nhiều trường cùng lúc
```powershell
if ($global:testOrderId) {
    $updateData = @{
        Trang_thai_don = 'Đang giao'
        SDT_nguoi_nhan = '0988888888'
        ten_nguoi_nhan = 'Nguyen Van A - Updated'
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/$global:testOrderId" -Method Put -Headers $headers -Body $updateData
        Write-Host "✅ UPDATE Multiple Fields Success!" -ForegroundColor Green
        $response.data | Format-List Ma_don_hang, Trang_thai_don, SDT_nguoi_nhan, ten_nguoi_nhan
    } catch {
        Write-Host "❌ UPDATE Order Failed" -ForegroundColor Red
        Write-Host "Error: $($_.ErrorDetails.Message)"
    }
} else {
    Write-Host "⚠️ Skipped - No test order created" -ForegroundColor Yellow
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Tất cả các trường đã được update

---

### ❌ Test 6.3: UPDATE order không tồn tại
```powershell
$updateData = @{
    Trang_thai_don = 'Đang xử lý'
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/DH9999" -Method Put -Headers $headers -Body $updateData
    Write-Host "❌ FAILED: Should return 404" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Update non-exist order rejected" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 404
- ✅ Message: "Không tìm thấy đơn hàng với mã DH9999"

---

## 7. Test Order Management - DELETE

### ✅ Test 7.1: DELETE order mới tạo (cleanup)
```powershell
if ($global:testOrderId) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/$global:testOrderId" -Method Delete -Headers $headers
        Write-Host "✅ DELETE Order Success!" -ForegroundColor Green
        Write-Host "Message: $($response.message)"
    } catch {
        Write-Host "⚠️ DELETE Order Warning:" -ForegroundColor Yellow
        Write-Host "Error: $($_.ErrorDetails.Message)"
        Write-Host "(This might fail if order has dependencies)"
    }
} else {
    Write-Host "⚠️ Skipped - No test order to delete" -ForegroundColor Yellow
}
```

**Expected Result (nếu không có dependency):**
- ✅ Status 200
- ✅ Message: "Xóa đơn hàng thành công"

---

### ❌ Test 7.2: DELETE order không tồn tại
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/don-hang/DH9999" -Method Delete -Headers $headers
    Write-Host "❌ FAILED: Should return 404" -ForegroundColor Red
} catch {
    Write-Host "✅ PASSED: Delete non-exist order rejected" -ForegroundColor Green
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 404
- ✅ Message: "Không tìm thấy đơn hàng với mã DH9999"

---

## 8. Test Reports

### ✅ Test 8.1: GET Top Tài Xế (default: top 10, minStar 4.0)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/bao-cao/top-tai-xe" -Method Get -Headers $headers
    Write-Host "✅ Top Drivers Report Success!" -ForegroundColor Green
    Write-Host "Total drivers returned: $($response.data.Count)"
    if ($response.data.Count -gt 0) {
        $response.data | Select-Object -First 5 | Format-Table Ma_tai_xe, Ten_tai_xe, so_don_giao, diem_trung_binh
    } else {
        Write-Host "⚠️ No drivers found (might be due to no completed orders)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Top Drivers Report Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Danh sách tài xế có rating >= 4.0
- ✅ Sắp xếp theo số đơn giao (DESC)

---

### ✅ Test 8.2: GET Top Tài Xế (custom: top 5, minStar 4.5)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/bao-cao/top-tai-xe?topN=5&minStar=4.5" -Method Get -Headers $headers
    Write-Host "✅ Top 5 Drivers (minStar 4.5) Success!" -ForegroundColor Green
    $response.data | Format-Table Ma_tai_xe, Ten_tai_xe, so_don_giao, diem_trung_binh
} catch {
    Write-Host "⚠️ Top Drivers Report Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Tối đa 5 tài xế
- ✅ Tất cả có rating >= 4.5

---

### ✅ Test 8.3: GET Top Khách Hàng (default: top 10)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/bao-cao/top-khach-hang" -Method Get -Headers $headers
    Write-Host "✅ Top Customers Report Success!" -ForegroundColor Green
    Write-Host "Total customers returned: $($response.data.Count)"
    if ($response.data.Count -gt 0) {
        $response.data | Select-Object -First 5 | Format-Table Ma_khach_hang, Email, SDT, total_revenue
    } else {
        Write-Host "⚠️ No customers found (might be due to no completed orders)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Top Customers Report Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Danh sách khách hàng
- ✅ Sắp xếp theo tổng chi tiêu (DESC)

---

### ✅ Test 8.4: GET Top Khách Hàng (custom: top 3, date range)
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/bao-cao/top-khach-hang?topN=3&startDate=2024-01-01&endDate=2025-12-31" -Method Get -Headers $headers
    Write-Host "✅ Top 3 Customers (with date range) Success!" -ForegroundColor Green
    $response.data | Format-Table Ma_khach_hang, Email, total_revenue
} catch {
    Write-Host "⚠️ Top Customers Report Warning:" -ForegroundColor Yellow
    Write-Host "Error: $($_.ErrorDetails.Message)"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Tối đa 3 khách hàng
- ✅ Chỉ orders trong date range

---


## 📝 Checklist Tổng Hợp

Đánh dấu ✅ vào các test đã pass:

### Authentication (3/3)
- [ ] Login thành công (sManager/Nhom6251)
- [ ] Login sai password
- [ ] Login user không tồn tại

### Driver Management - Person 2 (6/6)
- [ ] GET tất cả tài xế
- [ ] GET tài xế by ID
- [ ] GET driver không tồn tại
- [ ] CREATE tài xế mới
- [ ] UPDATE tài xế
- [ ] DELETE tài xế

### Order Management - GET - Person 3 (8/8)
- [ ] GET tất cả orders (no filter)
- [ ] Filter theo trạng thái
- [ ] Filter theo khách hàng
- [ ] Sort ASC
- [ ] Sort DESC
- [ ] Pagination page 1
- [ ] GET order by ID
- [ ] GET order không tồn tại

### Order Management - CREATE - Person 3 (3/3)
- [ ] CREATE order đầy đủ thông tin
- [ ] CREATE order thiếu trường bắt buộc
- [ ] CREATE order khách hàng không tồn tại

### Order Management - UPDATE - Person 3 (3/3)
- [ ] UPDATE trạng thái
- [ ] UPDATE nhiều trường
- [ ] UPDATE order không tồn tại

### Order Management - DELETE - Person 3 (2/2)
- [ ] DELETE order mới tạo
- [ ] DELETE order không tồn tại

### Reports - Person 3 (4/4)
- [ ] Top Tài Xế (default)
- [ ] Top Tài Xế (custom params)
- [ ] Top Khách Hàng (default)
- [ ] Top Khách Hàng (custom params)

---
**Ready for:** Production Testing
