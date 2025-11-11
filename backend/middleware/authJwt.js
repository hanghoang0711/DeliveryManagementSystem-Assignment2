const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Meomeo667708'; // Phải trùng với auth.routes.js

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
