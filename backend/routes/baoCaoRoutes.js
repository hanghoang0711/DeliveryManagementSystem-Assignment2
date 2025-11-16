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

module.exports = router;
