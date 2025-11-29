const { body, param, validationResult } = require("express-validator");

// Validation rules
const validateTaiXe = [
  body("DriverID").optional(),
  body("Ho_ten")
    .trim()
    .notEmpty()
    .withMessage("Họ tên không được để trống")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage("Họ tên chỉ được chứa chữ cái và khoảng trắng"),
  body("CCCD")
    .notEmpty()
    .withMessage("CCCD không được để trống")
    .isLength({ min: 12, max: 12 })
    .withMessage("CCCD phải đúng 12 ký tự")
    .matches(/^\d+$/)
    .withMessage("CCCD chỉ được chứa các chữ số"),

  body("Gioi_Tinh")
    .optional()
    .isIn(["Nam", "Nữ", "Khác"])
    .withMessage("Giới tính phải là Nam, Nữ hoặc Khác"),

  body("Ngay_Sinh")
    .notEmpty()
    .withMessage("Ngày sinh không được để trống")
    .custom((value) => {
      const birth = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();

      if (age < 18 || (age === 18 && m < 0)) {
        throw new Error("Tuổi phải >= 18");
      }
      return true;
    }),

  body("Ngay_Bat_Dau_Lam_Viec")
    .notEmpty()
    .withMessage("Ngày bắt đầu làm việc không được để trống")
    .custom((value, { req }) => {
      if (req.body.Ngay_Sinh) {
        const birth = new Date(req.body.Ngay_Sinh);
        const start = new Date(value);
        if (start <= birth)
          throw new Error("Ngày bắt đầu làm việc phải sau ngày sinh");
      }
      return true;
    }),

  body("Ma_Nhan_Vien_quan_li")
    .notEmpty()
    .withMessage("Mã nhân viên quản lý không được để trống"),

  body("Trang_Thai").optional().isString(),

  body("Rating")
    .optional()
    .isDecimal({ decimal_digits: "0,1" })
    .withMessage("Rating phải là số thập phân (2,1)")
    .custom((value) => {
      if (value < 0 || value > 5) throw new Error("Rating phải từ 0 đến 5");
      return true;
    }),

  body("Ngay_Bat_Dau_Quan_Ly").optional(),
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
  param("id").notEmpty().withMessage("DriverID không được để trống"),
];

// Validation rules cho UPDATE tài xế
const validateTaiXeUpdate = [
  body("Ho_ten")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Họ tên không được để trống")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage("Họ tên chỉ được chứa chữ cái và khoảng trắng")
    ,

  body("CCCD")
    .optional()
    .notEmpty()
    .withMessage("CCCD không được để trống")
    .isLength({ min: 12, max: 12 })
    .withMessage("CCCD phải đúng 12 ký tự")
    .matches(/^\d+$/)
    .withMessage("CCCD chỉ được chứa các chữ số")
    ,

  body("Rating")
    .optional()
    .custom((value) => {
      if (value < 0 || value > 5) throw new Error("Rating phải từ 0 đến 5");
      return true;
    }),
];
module.exports = {
  validateTaiXe,
  handleValidation,
  validateDriverIDParam,
  validateTaiXeUpdate
};