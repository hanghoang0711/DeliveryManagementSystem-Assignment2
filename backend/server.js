const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();
const db = require('./models');

// ============================================
// MIDDLEWARE
// ============================================  
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// SWAGGER UI
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Delivery Management API",
  customCss: '.swagger-ui .topbar { display: none }'
}));

// ============================================
// ROUTES - (DRIVER DOMAIN)
// ============================================
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const driverRoutes = require('./routes/driver.routes');
app.use('/api/driver', driverRoutes);

// ============================================
// ROUTES - (ORDER DOMAIN)
// ============================================
const donHangRoutes = require('./routes/donHangRoutes');
app.use('/api/don-hang', donHangRoutes);

const baoCaoRoutes = require('./routes/baoCaoRoutes');
app.use('/api/bao-cao', baoCaoRoutes);

// ============================================
// ROUTES - (DELIVERY DOMAIN - ERD v2)
// ============================================
const chuyenGiaoHangRoutes = require('./routes/chuyenGiaoHangRoutes');
app.use('/api/chuyen-giao-hang', chuyenGiaoHangRoutes);

// ============================================
// SERVER START
// ============================================
const PORT = process.env.PORT || 3000;

// Skip sync - tables already exist in database
app.listen(PORT, () => {
  console.log("✅ Database đã kết nối thành công!");
  console.log(`🚀 Server chạy trên port ${PORT}`);
  console.log(`📍 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`📍 Driver: http://localhost:${PORT}/api/driver`);
  console.log(`📍 Orders: http://localhost:${PORT}/api/don-hang`);
  console.log(`📍 Delivery: http://localhost:${PORT}/api/chuyen-giao-hang`);
  console.log(`📍 Reports: http://localhost:${PORT}/api/bao-cao`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});


