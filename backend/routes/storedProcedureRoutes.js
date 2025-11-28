/**
 * STORED PROCEDURE ROUTES
 * Định nghĩa các route endpoints cho stored procedures
 */

const express = require('express');
const router = express.Router();
const spController = require('../controllers/storedProcedureController');
const { verifyToken } = require('../middleware/authJwt');

/**
 * ============================================
 * TẤT CẢ ROUTES ĐỀU ĐƯỢC BẢO VỆ BỞI JWT
 * ============================================
 */

/**
 * @swagger
 * /api/sp/nhanvien:
 *   post:
 *     summary: Create employee using sp_ThemNhanVien
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Ten, Gioi_tinh, Ngay_sinh, SDT, email, CCCD, Ngay_bat_dau_lam, Vai_tro]
 *             properties:
 *               Ho_va_ten_lot:
 *                 type: string
 *                 example: "Nguyen Van"
 *               Ten:
 *                 type: string
 *                 example: "Nam"
 *               Gioi_tinh:
 *                 type: string
 *                 enum: [Nam, Nữ, Khác]
 *                 example: "Nam"
 *               Ngay_sinh:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               Dia_chi:
 *                 type: string
 *                 example: "123 Le Loi, Q1, TPHCM"
 *               SDT:
 *                 type: string
 *                 example: "0901234567"
 *               email:
 *                 type: string
 *                 example: "nguyenvannam@example.com"
 *               CCCD:
 *                 type: string
 *                 example: "001234567890"
 *               Ngay_bat_dau_lam:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               Vai_tro:
 *                 type: string
 *                 example: "Nhân viên giao hàng"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/nhanvien', verifyToken, spController.createNhanVien);

/**
 * @swagger
 * /api/sp/khachhang:
 *   post:
 *     summary: Register customer using sp_DangKyKhachHang
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, Loai_khach_hang]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "customer@example.com"
 *               Ho_va_ten_lot:
 *                 type: string
 *                 example: "Tran Thi"
 *                 description: For individual customers
 *               Ten:
 *                 type: string
 *                 example: "Mai"
 *                 description: For individual customers (required if CANHAN)
 *               Ten_doanh_nghiep:
 *                 type: string
 *                 example: "Cong ty ABC"
 *                 description: For business customers (required if DOANHNGHIEP)
 *               Ma_so_thue:
 *                 type: string
 *                 example: "0123456789"
 *                 description: For business customers (required if DOANHNGHIEP)
 *               Loai_khach_hang:
 *                 type: string
 *                 enum: [CANHAN, DOANHNGHIEP]
 *                 example: "CANHAN"
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/khachhang', verifyToken, spController.createKhachHang);

/**
 * @swagger
 * /api/sp/danhgia:
 *   post:
 *     summary: Create review using sp_TaoDanhGia
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Ma_khach_hang, Ma_don_hang, Rating, Comment]
 *             properties:
 *               Ma_khach_hang:
 *                 type: string
 *                 example: "KH1"
 *               Ma_don_hang:
 *                 type: string
 *                 example: "DH001"
 *               Rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               Comment:
 *                 type: string
 *                 example: "Dịch vụ tốt, giao hàng nhanh"
 *               DriverID:
 *                 type: string
 *                 example: "DRV001"
 *                 description: Optional driver ID to review
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid rating or missing fields
 *       500:
 *         description: Server error
 */
router.post('/danhgia', verifyToken, spController.createDanhGia);

/**
 * @swagger
 * /api/sp/yeucauhotro:
 *   post:
 *     summary: Create support request using sp_TaoYeuCauHoTro
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Ma_khach_hang, Loai_van_de, Noi_dung]
 *             properties:
 *               Ma_khach_hang:
 *                 type: string
 *                 example: "KH1"
 *               Loai_van_de:
 *                 type: string
 *                 example: "Khiếu nại đơn hàng"
 *               Noi_dung:
 *                 type: string
 *                 example: "Đơn hàng bị giao trễ, yêu cầu kiểm tra"
 *     responses:
 *       201:
 *         description: Support request created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/yeucauhotro', verifyToken, spController.createYeuCauHoTro);

/**
 * @swagger
 * /api/sp/thanhtoan:
 *   post:
 *     summary: Create payment using sp_TaoThanhToan
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Ma_khach_hang, phuong_thuc, so_tien]
 *             properties:
 *               Ma_khach_hang:
 *                 type: string
 *                 example: "KH1"
 *               phuong_thuc:
 *                 type: string
 *                 example: "Chuyển khoản"
 *               so_tien:
 *                 type: number
 *                 example: 200000
 *               trang_thai:
 *                 type: string
 *                 example: "Thành công"
 *                 description: Default is "Thành công"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/thanhtoan', verifyToken, spController.createThanhToan);

/**
 * @swagger
 * /api/sp/xe:
 *   post:
 *     summary: Add vehicle using sp_ThemXe
 *     tags: [Stored Procedures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Bien_so, Chu_so_huu, Nam_san_xuat, Loai_xe]
 *             properties:
 *               Bien_so:
 *                 type: string
 *                 example: "51A-12345"
 *               Chu_so_huu:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               Nam_san_xuat:
 *                 type: string
 *                 example: "2020"
 *               Tinh_trang:
 *                 type: string
 *                 example: "Sẵn sàng"
 *               Loai_xe:
 *                 type: string
 *                 enum: [XEMAY, XETAI]
 *                 example: "XEMAY"
 *               Phan_khoi:
 *                 type: integer
 *                 example: 125
 *                 description: For motorbikes
 *               Khoang_cho:
 *                 type: number
 *                 example: 0.5
 *                 description: For motorbikes (m3)
 *               Trong_tai:
 *                 type: integer
 *                 example: 500
 *                 description: For trucks (kg)
 *               Loai_thung:
 *                 type: string
 *                 example: "Thùng kín"
 *                 description: For trucks
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/xe', verifyToken, spController.createXe);

module.exports = router;
