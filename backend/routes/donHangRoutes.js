/**
 * DON_HANG ROUTES
 * Định nghĩa các route endpoints cho quản lý đơn hàng
 */

const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHangController');
const { verifyToken } = require('../middleware/authJwt');

/**
 * ============================================
 * TẤT CẢ ROUTES ĐỀU ĐƯỢC BẢO VỆ BỞI JWT
 * ============================================
 * Client phải gửi header: Authorization: Bearer <token>
 */

/**
 * @swagger
 * /api/don-hang:
 *   get:
 *     summary: Get all orders (with filter, sort, pagination)
 *     tags: [Order Management]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: trang_thai_don
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: ma_khach_hang
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of orders with pagination
 */
router.get('/', verifyToken, donHangController.getAllDonHang);

/**
 * @swagger
 * /api/don-hang/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', verifyToken, donHangController.getDonHangById);

/**
 * @swagger
 * /api/don-hang:
 *   post:
 *     summary: Create new order
 *     tags: [Order Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Customer not found
 */
router.post('/', verifyToken, donHangController.createDonHang);

/**
 * @swagger
 * /api/don-hang/{id}:
 *   put:
 *     summary: Update order
 *     tags: [Order Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Trang_thai_don:
 *                 type: string
 *               SDT_nguoi_nhan:
 *                 type: string
 *               ten_nguoi_nhan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
router.put('/:id', verifyToken, donHangController.updateDonHang);

/**
 * @swagger
 * /api/don-hang/{id}:
 *   delete:
 *     summary: Delete order
 *     tags: [Order Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       400:
 *         description: Cannot delete order with dependencies
 */
router.delete('/:id', verifyToken, donHangController.deleteDonHang);

module.exports = router;
