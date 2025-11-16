const express = require("express");
const router = express.Router();
const taixeController = require("../controllers/driver.controller");
const { validateTaiXe, handleValidation, validateDriverIDParam } = require("../middleware/driver.validator");
const { verifyToken } = require("../middleware/authJwt");

/**
 * @swagger
 * /api/driver:
 *   post:
 *     summary: Create new driver
 *     tags: [Driver Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", verifyToken, validateTaiXe, handleValidation, taixeController.createTaiXe);

/**
 * @swagger
 * /api/driver:
 *   get:
 *     summary: Get all drivers
 *     tags: [Driver Management]
 *     responses:
 *       200:
 *         description: List of drivers
 */
router.get("/", verifyToken, taixeController.getAllTaiXe);

/**
 * @swagger
 * /api/driver/{id}:
 *   get:
 *     summary: Get driver by ID
 *     tags: [Driver Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver details
 *       404:
 *         description: Driver not found
 */
router.get("/:id", verifyToken, validateDriverIDParam, handleValidation, taixeController.getTaiXeById);

/**
 * @swagger
 * /api/driver/{id}:
 *   put:
 *     summary: Update driver
 *     tags: [Driver Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Ho_ten:
 *                 type: string
 *               Rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       404:
 *         description: Driver not found
 */
router.put("/:id", verifyToken, validateDriverIDParam, handleValidation, taixeController.updateTaiXe);

/**
 * @swagger
 * /api/driver/{id}:
 *   delete:
 *     summary: Delete driver
 *     tags: [Driver Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 */
router.delete("/:id", verifyToken, validateDriverIDParam, handleValidation, taixeController.deleteTaiXe);

module.exports = router;
