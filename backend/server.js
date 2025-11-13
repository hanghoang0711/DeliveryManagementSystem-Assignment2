const express = require('express');
const app = express();
const db = require('./models');

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const driverRoutes = require('./routes/driver.routes'); // nhớ import CRUD
app.use('/api/driver', driverRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database đã sync thành công!");
    app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
  })
  .catch(err => console.error("Sync database thất bại:", err));
