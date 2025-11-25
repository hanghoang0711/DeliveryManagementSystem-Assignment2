/**
 * BAO_CAO ROUTES
 * Định nghĩa các route endpoints cho báo cáo và thống kê
 */

const express = require('express');
const router = express.Router();
const baoCaoController = require('../controllers/baoCaoController');
const { verifyToken } = require('../middleware/authJwt');

/**
 * ============================================
 * TẤT CẢ ROUTES ĐỀU ĐƯỢC BẢO VỆ BỞI JWT
 * ============================================
 */

/**
 * @swagger
 * /api/bao-cao/top-tai-xe:
 *   get:
 *     summary: Get top drivers by rating
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: topN
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of drivers to return
 *       - in: query
 *         name: minStar
 *         schema:
 *           type: number
 *           format: decimal
 *           default: 4.0
 *         description: Minimum rating
 *     responses:
 *       200:
 *         description: List of top drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Ma_tai_xe:
 *                         type: string
 *                       Ten_tai_xe:
 *                         type: string
 *                       so_don_giao:
 *                         type: integer
 *                       diem_trung_binh:
 *                         type: number
 */
router.get('/top-tai-xe', verifyToken, baoCaoController.getTopTaiXe);

/**
 * @swagger
 * /api/bao-cao/top-khach-hang:
 *   get:
 *     summary: Get top customers by revenue
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: topN
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of customers to return
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of top customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Ma_khach_hang:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       SDT:
 *                         type: string
 *                       total_revenue:
 *                         type: number
 */
router.get('/top-khach-hang', verifyToken, baoCaoController.getTopKhachHang);

/**
 * @swagger
 * /api/bao-cao/tao-don-hang-sp:
 *   post:
 *     summary: Create order using stored procedure sp_TaoDonHang
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Ma_khach_hang
 *               - SDT_nguoi_nhan
 *               - ten_nguoi_nhan
 *               - dia_chi_lay_hang
 *               - dia_chi_giao_hang
 *               - can_nang
 *               - gia_tri_hang_hoa
 *               - phuong_thuc_giao_hang
 *             properties:
 *               Ma_khach_hang:
 *                 type: string
 *                 example: "KH1"
 *                 description: Customer ID
 *               SDT_nguoi_nhan:
 *                 type: string
 *                 example: "0901234567"
 *                 description: Receiver phone number
 *               ten_nguoi_nhan:
 *                 type: string
 *                 example: "Nguyen Van A"
 *                 description: Receiver name
 *               dia_chi_lay_hang:
 *                 type: string
 *                 example: "123 Le Loi, Q1, TPHCM"
 *                 description: Pickup address
 *               dia_chi_giao_hang:
 *                 type: string
 *                 example: "456 Nguyen Hue, Q3, TPHCM"
 *                 description: Delivery address
 *               can_nang:
 *                 type: number
 *                 format: decimal
 *                 example: 2.5
 *                 description: Weight in kg
 *               gia_tri_hang_hoa:
 *                 type: number
 *                 format: money
 *                 example: 150000
 *                 description: Product value in VND
 *               phuong_thuc_giao_hang:
 *                 type: string
 *                 example: "Giao nhanh"
 *                 description: Delivery method
 *     responses:
 *       201:
 *         description: Order created successfully using stored procedure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     Ma_don_hang:
 *                       type: string
 *                     Trang_thai_don:
 *                       type: string
 *                     phi_van_chuyen:
 *                       type: number
 *                     thoi_gian_giao_du_kien:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Stored procedure error
 */
router.post('/tao-don-hang-sp', verifyToken, baoCaoController.createOrderUsingSP);

module.exports = router;
