const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

// CHÚ Ý: Đổi SECRET_KEY trong môi trường production!
const SECRET_KEY = 'Meomeo667708'; 

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // 1. Tìm người dùng
  try {
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // 2. So sánh mật khẩu
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: 'Invalid username or password' });

    // 3. Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' } // Token hết hạn sau 24 giờ
    );

    // 4. Trả về Token và thông tin người dùng
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  // Đối với JWT, logout chỉ là thông báo (Client tự xóa token)
  return res.json({ message: 'Logout successful' });
};

// Middleware để xác minh token (Chỉ dùng cho các route bảo mật)
exports.verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header)
    return res.status(403).json({ message: 'No token provided' });

  const token = header.split(' ')[1]; // format: "Bearer <token>"

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: 'Unauthorized' });

    req.user = decoded;
    next();
  });
};