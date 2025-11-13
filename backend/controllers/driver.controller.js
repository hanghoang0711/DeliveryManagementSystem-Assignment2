const { TaiXe, TaiXeXeMay, TaiXeXeTai, TaiXeSDT, GhiChuQuanLyTaiXe, NhanVienQuanLyTaiXe, NhanVien } = require("../models");

// Create TaiXe
exports.createTaiXe = async (req, res) => {
  try {
    const newTaiXe = await TaiXe.create(req.body);
    res.status(201).json({ message: "Tài xế tạo thành công", data: newTaiXe });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo tài xế", error: error.message });
  }
};

// Get all TaiXe
exports.getAllTaiXe = async (req, res) => {
  try {
    const taixeList = await TaiXe.findAll({
      include: [
        { model: TaiXeXeMay },
        { model: TaiXeXeTai },
        { model: TaiXeSDT },
        { model: GhiChuQuanLyTaiXe },
        { model: NhanVienQuanLyTaiXe, include: [ NhanVien ] }
      ]
    });
    res.json({ message: "Danh sách tài xế", data: taixeList });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tài xế", error: error.message });
  }
};

// Get single TaiXe by DriverID
exports.getTaiXeById = async (req, res) => {
  try {
    const { id } = req.params;
    const taixe = await TaiXe.findByPk(id, {
      include: [
        { model: TaiXeXeMay },
        { model: TaiXeXeTai },
        { model: TaiXeSDT },
        { model: GhiChuQuanLyTaiXe },
        { model: NhanVienQuanLyTaiXe, include: [ NhanVien ] }
      ]
    });
    if (!taixe) return res.status(404).json({ message: "Không tìm thấy tài xế" });
    res.json({ message: "Thông tin tài xế", data: taixe });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin tài xế", error: error.message });
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
