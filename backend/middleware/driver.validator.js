const { body, param, validationResult } = require("express-validator");

// Validation rules
const validateTaiXe = [
  body("DriverID")
    .notEmpty().withMessage("DriverID không được để trống"),

  body("Ho_ten")
    .notEmpty().withMessage("Họ tên không được để trống"),

  body("CCCD")
    .notEmpty().withMessage("CCCD không được để trống")
    .isLength({ min: 12, max: 12 }).withMessage("CCCD phải đúng 12 ký tự"),

  body("Gioi_Tinh")
    .optional()
    .isIn(["Nam", "Nữ", "Khác"]).withMessage("Giới tính phải là Nam, Nữ hoặc Khác"),

  body("Ngay_Sinh")
    .notEmpty().withMessage("Ngày sinh không được để trống")
    .custom((value) => {
      const today = new Date();
      const birth = new Date(value);
      const age = today.getFullYear() - birth.getFullYear();
      if (age < 18) throw new Error("Tuổi phải >= 18");
      return true;
    }),

  body("Ngay_Bat_Dau_Lam_Viec")
    .notEmpty().withMessage("Ngày bắt đầu làm việc không được để trống")
    .custom((value, { req }) => {
      if (req.body.Ngay_Sinh) {
        const birth = new Date(req.body.Ngay_Sinh);
        const start = new Date(value);
        if (start <= birth) throw new Error("Ngày bắt đầu làm việc phải sau ngày sinh");
      }
      return true;
    }),

  body("Ma_Nhan_Vien_quan_li")
    .notEmpty().withMessage("Mã nhân viên quản lý không được để trống"),

  body("Trang_Thai")
    .notEmpty().isString(),

  body("Rating")
    .optional().isDecimal({ decimal_digits: '0,1' }).withMessage("Rating phải là số thập phân (2,1)"),

  body("Ngay_Bat_Dau_Quan_Ly")
    .notEmpty().withMessage("Ngày bắt đầu quản lý không được để trống")
];

// Middleware xử lý kết quả validate
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Trả về tất cả lỗi, FE có thể hiển thị chi tiết
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateDriverIDParam = [
  param("id").notEmpty().withMessage("DriverID không được để trống")
];

module.exports = { validateTaiXe, handleValidation, validateDriverIDParam };

