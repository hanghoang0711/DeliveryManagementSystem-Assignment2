const { TaiXe, TaiXeXeMay, TaiXeXeTai, TaiXeSDT, GhiChuQuanLyTaiXe, NhanVienQuanLyTaiXe, ChuyenGiaoHang, Mentorship } = require("../models");
const { Op } = require("sequelize");


// Create TaiXe
exports.createTaiXe = async (req, res) => {
  try {

    const newTaiXe = await TaiXe.create(req.body);

    if (req.body.Ma_Nhan_Vien_quan_li) {
      await NhanVienQuanLyTaiXe.increment(
        { So_luong_tai_xe_dang_phu_trach: 1 },
        { where: { Ma_nhan_vien: req.body.Ma_Nhan_Vien_quan_li } }
      );
    }

    const taiXeData = newTaiXe.toJSON();

    res.status(201).json({
      message: "Tài xế tạo thành công",
      data: taiXeData
    });

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
     if (req.body.Ma_Nhan_Vien_quan_li && req.body.Ma_Nhan_Vien_quan_li !== taixe.Ma_Nhan_Vien_quan_li) {
      await NhanVienQuanLyTaiXe.decrement(
        { So_luong_tai_xe_dang_phu_trach: 1 },
        { where: { Ma_nhan_vien: taixe.Ma_Nhan_Vien_quan_li } }
      );
      await NhanVienQuanLyTaiXe.increment(
        { So_luong_tai_xe_dang_phu_trach: 1 },
        { where: { Ma_nhan_vien: req.body.Ma_Nhan_Vien_quan_li } }
      );
    }

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
    await NhanVienQuanLyTaiXe.decrement(
      { So_luong_tai_xe_dang_phu_trach: 1 },
      { where: { Ma_nhan_vien: driver.Ma_Nhan_Vien_quan_li } }
    );
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

exports.getTaiXeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy tài xế kèm các quan hệ
    let taixe = await TaiXe.findOne({
      where: { DriverID: id },
      include: [
        // Số điện thoại
        { model: TaiXeSDT, foreignKey: "DriverID", sourceKey: "DriverID" },
        // Xe máy
        { model: TaiXeXeMay, foreignKey: "DriverID", sourceKey: "DriverID" },
        // Xe tải
        { model: TaiXeXeTai, foreignKey: "DriverID", sourceKey: "DriverID" },
        // Chuyến giao hàng
        { model: ChuyenGiaoHang, foreignKey: "DriverID", sourceKey: "DriverID" },
        // Ghi chú quản lý tài xế
        { model: GhiChuQuanLyTaiXe, foreignKey: "Ma_tai_xe", sourceKey: "DriverID" },
        // Nhân viên quản lý tài xế
        { model: NhanVienQuanLyTaiXe, foreignKey: "Ma_nhan_vien", targetKey: "Ma_Nhan_Vien_quan_li" }
      ]
    });

    if (!taixe) {
      return res.status(404).json({ message: "Không tìm thấy tài xế" });
    }

    // Chuyển Sequelize instance sang plain object
    taixe = taixe.toJSON();

    // Ẩn xe máy nếu không tồn tại
    if (!taixe.TAI_XE_XE_MAY || Object.keys(taixe.TAI_XE_XE_MAY).length === 0) {
      delete taixe.TAI_XE_XE_MAY;
    }

    // Ẩn xe tải nếu không tồn tại
    if (!taixe.TAI_XE_XE_TAI || Object.keys(taixe.TAI_XE_XE_TAI).length === 0) {
      delete taixe.TAI_XE_XE_TAI;
    }

    res.json({ message: "Thông tin tài xế chi tiết", data: taixe });

  } catch (error) {
    console.error("GET Driver Detail Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết tài xế",
      error: error.message || error.toString()
    });
  }
};