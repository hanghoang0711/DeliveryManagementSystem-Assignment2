const { TaiXe, TaiXeXeMay, TaiXeXeTai, TaiXeSDT, GhiChuQuanLyTaiXe, NhanVienQuanLyTaiXe, NhanVien } = require("../models");

// Create TaiXe
exports.createTaiXe = async (req, res) => {
  try {
    const newTaiXe = await TaiXe.create(req.body);
    res.status(201).json({ message: "Tài xế tạo thành công", data: newTaiXe });
  } catch (error) {
    console.error('❌ CREATE Driver Error:', error); // Full error log
    res.status(400).json({ 
      message: "Lỗi khi tạo tài xế", 
      error: error.message || error.toString()
    });
  }
};

// Get all TaiXe
exports.getAllTaiXe = async (req, res) => {
  try {
    // Simple query without includes to avoid association errors
    const taixeList = await TaiXe.findAll();
    console.log(`✅ Found ${taixeList.length} drivers`); // Debug log
    res.json({ message: "Danh sách tài xế", data: taixeList });
  } catch (error) {
    console.error('❌ GET Drivers Error:', error); // Full error log
    console.error('Error name:', error.name);
    console.error('Error SQL:', error.sql); // Log SQL query if available
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách tài xế", 
      error: error.name || error.message || error.toString()
    });
  }
};

// Get single TaiXe by DriverID
exports.getTaiXeById = async (req, res) => {
  try {
    const { id } = req.params;
    // Simple query without includes to avoid association errors
    const taixe = await TaiXe.findByPk(id);
    if (!taixe) return res.status(404).json({ message: "Không tìm thấy tài xế" });
    res.json({ message: "Thông tin tài xế", data: taixe });
  } catch (error) {
    console.error('❌ GET Driver By ID Error:', error); // Full error log
    console.error('Error SQL:', error.sql); // Log SQL query if available
    res.status(500).json({ 
      message: "Lỗi khi lấy thông tin tài xế", 
      error: error.name || error.message || error.toString()
    });
  }
};

// Update TaiXe
exports.updateTaiXe = async (req, res) => {
  try {
    const { id } = req.params;
    const taixe = await TaiXe.findByPk(id);
    if (!taixe) return res.status(404).json({ message: "Không tìm thấy tài xế" });

    await taixe.update(req.body);
    res.json({ message: "Cập nhật tài xế thành công", data: taixe });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật tài xế", error: error.message });
  }
};

// Delete TaiXe
exports.deleteTaiXe = async (req, res) => {
  try {
    const { id } = req.params;
    const taixe = await TaiXe.findByPk(id);
    if (!taixe) return res.status(404).json({ message: "Không tìm thấy tài xế" });

    await taixe.destroy();
    res.json({ message: "Xóa tài xế thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tài xế", error: error.message });
  }
};
