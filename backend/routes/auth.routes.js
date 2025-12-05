const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/authJwt");

// 1. Đưa tất cả vào biến môi trường
const USERNAME = process.env.DB_USER || "admin"; 
const PASSWORD = process.env.DB_PASSWORD; 
const SECRET = process.env.JWT_SECRET;
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to get JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập!" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    return res.json({
        message: "Đăng nhập thành công!",
        token
    });
});

// LOGOUT
router.post("/logout", (req, res) => {
    return res.json({ message: "Đăng xuất thành công (client tự xoá token)" });
});

// TEST route cần token
router.get("/admin", verifyToken, (req, res) => {
    res.json({
        message: "Bạn đã truy cập được route admin!",
        user: req.username
    });
});

module.exports = router;
