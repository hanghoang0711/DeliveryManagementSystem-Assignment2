/**
 * CHUYEN_GIAO_HANG ROUTES
 * Định nghĩa các endpoint API cho quản lý chuyến giao hàng
 */

const express = require('express');
const router = express.Router();
const chuyenGiaoHangController = require('../controllers/chuyenGiaoHangController');
// const { authJwt } = require('../middleware'); // Uncomment nếu cần authentication

/**
 * @swagger
 * tags:
 *   name: ChuyenGiaoHang
 *   description: API quản lý chuyến giao hàng
 */

/**
 * @swagger
 * /api/chuyen-giao-hang:
 *   get:
 *     summary: Lấy danh sách chuyến giao hàng
 *     tags: [ChuyenGiaoHang]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: driver_id
 *         schema:
 *           type: string
 *         description: Lọc theo mã tài xế
 *       - in: query
 *         name: trang_thai
 *         schema:
 *           type: string
 *           enum: ['', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy', 'Không tồn tại']
 *         description: Lọc theo trạng thái chuyến (để trống để lấy tất cả, chọn "Không tồn tại" để test empty result)
 *     responses:
 *       200:
 *         description: Danh sách chuyến giao hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChuyenGiaoHang'
 */
router.get('/', chuyenGiaoHangController.getAllChuyenGiaoHang);

/**
 * @swagger
 * /api/chuyen-giao-hang/{id}:
 *   get:
 *     summary: Lấy chi tiết chuyến giao hàng
 *     tags: [ChuyenGiaoHang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chuyến giao hàng
 *         example: CGH001
 *     responses:
 *       200:
 *         description: Chi tiết chuyến giao hàng với danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     DeliveryID:
 *                       type: string
 *                     DriverID:
 *                       type: string
 *                     so_luong_don_gop:
 *                       type: integer
 *                     TrangThaiChuyen:
 *                       type: string
 *                     taiXe:
 *                       type: object
 *                     donHangs:
 *                       type: array
 *                     tong_quang_duong_tinh_toan:
 *                       type: string
 *       404:
 *         description: Không tìm thấy chuyến giao hàng
 */
router.get('/:id', chuyenGiaoHangController.getChuyenGiaoHangById);

/**
 * @swagger
 * /api/chuyen-giao-hang/{id}/total-distance:
 *   get:
 *     summary: Tính tổng quãng đường của chuyến
 *     tags: [ChuyenGiaoHang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chuyến giao hàng
 *         example: CGH001
 *     responses:
 *       200:
 *         description: Tổng quãng đường tính toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     DeliveryID:
 *                       type: string
 *                       example: CGH001
 *                     so_luong_don:
 *                       type: integer
 *                       example: 3
 *                     tong_quang_duong_km:
 *                       type: string
 *                       example: "42.50"
 */
router.get('/:id/total-distance', chuyenGiaoHangController.calculateTotalDistance);

/**
 * @swagger
 * /api/chuyen-giao-hang:
 *   post:
 *     summary: Tạo chuyến giao hàng mới
 *     tags: [ChuyenGiaoHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChuyenGiaoHang'
 *           example:
 *             DriverID: DRV001
 *     responses:
 *       201:
 *         description: Tạo chuyến giao hàng thành công
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
 *                   $ref: '#/components/schemas/ChuyenGiaoHang'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', chuyenGiaoHangController.createChuyenGiaoHang);

/**
 * @swagger
 * /api/chuyen-giao-hang/{id}/add-don-hang:
 *   post:
 *     summary: Gộp đơn hàng vào chuyến giao hàng
 *     tags: [ChuyenGiaoHang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chuyến giao hàng
 *         example: CGH001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddOrderToDelivery'
 *           example:
 *             Ma_don_hang: DH001
 *             Thu_tu_lay_hang: 1
 *             Thu_tu_giao_hang: 1
 *     responses:
 *       200:
 *         description: Gộp đơn hàng thành công
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
 *                     DeliveryID:
 *                       type: string
 *                     Ma_don_hang:
 *                       type: string
 *                     so_luong_don_gop_moi:
 *                       type: integer
 *       400:
 *         description: Đơn hàng đã tồn tại trong chuyến hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy chuyến giao hàng hoặc đơn hàng
 */
router.post('/:id/add-don-hang', chuyenGiaoHangController.addDonHangToChuyenGiao);

/**
 * @swagger
 * /api/chuyen-giao-hang/{id}:
 *   put:
 *     summary: Cập nhật trạng thái chuyến giao hàng
 *     tags: [ChuyenGiaoHang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chuyến giao hàng
 *         example: CGH001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TrangThaiChuyen:
 *                 type: string
 *                 enum: [Đang thực hiện, Hoàn thành, Đã hủy]
 *           example:
 *             TrangThaiChuyen: Hoàn thành
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy chuyến giao hàng
 */
router.put('/:id', chuyenGiaoHangController.updateChuyenGiaoHang);

module.exports = router;
