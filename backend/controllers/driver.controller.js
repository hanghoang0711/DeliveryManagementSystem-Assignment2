const { TaiXe, TaiXeXeMay, TaiXeXeTai, TaiXeSDT, GhiChuQuanLyTaiXe, NhanVienQuanLyTaiXe, NhanVien, ChuyenGiaoHang, Mentorship } = require("../models");
const { Op } = require("sequelize");

// Create TaiXe
exports.createTaiXe = async (req, res) => {
  try {
    const newTaiXe = await TaiXe.create(req.body);
    res.status(201).json({ message: "Tài xế tạo thành công", data: newTaiXe });
  } catch (error) {
    console.error('CREATE Driver Error:', error);

    let fieldErrors = [];
    if (error.errors) {
      fieldErrors = error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      console.error(fieldErrors);
    }

    res.status(400).json({ 
      message: "Lỗi khi tạo tài xế", 
      error: error.message || error.toString(),
      fieldErrors
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
    console.error('UPDATE Driver Error:', error);

    let fieldErrors = [];
    if (error.errors) {
      fieldErrors = error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      console.error(fieldErrors);
    }

    res.status(400).json({ 
      message: "Lỗi khi cập nhật tài xế", 
      error: error.message,
      fieldErrors
    });
  }
};

// Delete TaiXe
exports.deleteTaiXe = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await TaiXe.findByPk(id);
    if (!driver) return res.status(404).json({ message: "Không tìm thấy tài xế" });

    const chuaHoanThanh = await ChuyenGiaoHang.findOne({
      where: { DriverID: id, TrangThaiChuyen: { [Op.ne]: "Hoàn thành" } }
    });

    if (chuaHoanThanh) {
      return res.status(409).json({
        message: "Không thể xóa tài xế: còn chuyến giao hàng chưa hoàn thành"
      });
    }

    await Mentorship.destroy({ where: { MentorID: id } });
    await Mentorship.destroy({ where: { MenteeID: id } });
    await driver.destroy();

    res.json({ message: "Xóa tài xế thành công" });

  } catch (error) {
    console.error('DELETE Driver Error:', error);

    let fieldErrors = [];
    if (error.errors) {
      fieldErrors = error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      console.error(fieldErrors);
    }

    res.status(500).json({ 
      message: "Lỗi khi xóa tài xế", 
      error: error.message,
      fieldErrors
    });
  }
};

// Get all TaiXe (không cần fieldErrors vì không validate input)
exports.getAllTaiXe = async (req, res) => {
  try {
    const taixeList = await TaiXe.findAll();
    console.log(`Found ${taixeList.length} drivers`);
    res.json({ message: "Danh sách tài xế", data: taixeList });
  } catch (error) {
    console.error('GET Drivers Error:', error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách tài xế", 
      error: error.name || error.message || error.toString()
    });
  }
};

// Get TaiXe by ID (không cần fieldErrors)
exports.getTaiXeById = async (req, res) => {
  try {
    const { id } = req.params;
    const taixe = await TaiXe.findByPk(id);
    if (!taixe) return res.status(404).json({ message: "Không tìm thấy tài xế" });
    res.json({ message: "Thông tin tài xế", data: taixe });
  } catch (error) {
    console.error('GET Driver By ID Error:', error);
    res.status(500).json({ 
      message: "Lỗi khi lấy thông tin tài xế", 
      error: error.name || error.message || error.toString()
    });
  }
};
