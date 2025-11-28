import { useState, useEffect } from 'react';
import './DriverForm.css';

const DriverForm = ({ driver, onSubmit, onClose }) => {
  // Form state
  const [formData, setFormData] = useState({
    Ho_ten: '',
    CCCD: '',
    Ngay_Sinh: new Date(),
    Ngay_Bat_Dau_Lam_Viec: new Date(),
    Ma_Nhan_Vien_quan_li: '',
    Ngay_Bat_Dau_Quan_Ly: new Date(),
    Trang_Thai: 'Đang hoạt động',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load driver data khi edit mode
  useEffect(() => {
    if (driver) {
      setFormData({
        Ho_ten: driver.Ho_ten || '',
        CCCD: driver.CCCD || '',
        Ngay_Sinh: new Date(driver.Ngay_Sinh),
        Ngay_Bat_Dau_Lam_Viec: driver.Ngay_Bat_Dau_Lam_Viec,
        Ma_Nhan_Vien_quan_li: driver.Ma_Nhan_Vien_quan_li,
        Trang_Thai: driver.Trang_Thai,
      });
    }
  }, [driver]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.Ho_ten.trim()) {
      newErrors.Ho_ten = 'Họ tên không được để trống';
    } else if (formData.Ho_ten.trim().length < 3) {
      newErrors.Ho_ten = 'Họ tên phải có ít nhất 3 ký tự';
    }

    if (!formData.CCCD.trim()) {
      newErrors.CCCD = 'CCCD không được để trống';
    } else if (!/^\d{12}$/.test(formData.CCCD)) {
      newErrors.CCCD = 'CCCD phải có 12 chữ số';
    }

    if (!formData.Ho_ten.trim()) {
      newErrors.Ho_ten = 'Họ tên không được để trống';
    }

    console.log(formData.Ngay_Sinh)

    if ((new Date()).getFullYear() - (new Date(formData.Ngay_Sinh)).getFullYear() < 18) {
      newErrors.Ngay_Sinh = 'Tài xế phải đủ 18 tuổi trở lên.';
    }

    if (!formData.Ma_Nhan_Vien_quan_li.trim()) {
      newErrors.Ma_Nhan_Vien_quan_li = 'Mã nhân viên quản lí không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
      // onSubmit sẽ handle thành công và đóng form
    } catch (error) {
      // Error đã được handle trong parent component
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = !!driver;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEditMode ? '✏️ Sửa thông tin tài xế' : '➕ Thêm tài xế mới'}</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="driver-form">

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="Ho_ten">
              Họ tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="Ho_ten"
              name="Ho_ten"
              value={formData.Ho_ten}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={errors.Ho_ten ? 'input-error' : ''}
            />
            {errors.Ho_ten && (
              <span className="error-message">{errors.Ho_ten}</span>
            )}
          </div>

          {/* CCCD */}
          <div className="form-group">
            <label htmlFor="CCCD">
              CCCD <span className="required">*</span>
            </label>
            <input
              type="text"
              id="CCCD"
              name="CCCD"
              value={formData.CCCD}
              onChange={handleChange}
              placeholder="001234567890"
              maxLength="12"
              className={errors.CCCD ? 'input-error' : ''}
            />
            {errors.CCCD && (
              <span className="error-message">{errors.CCCD}</span>
            )}
          </div>

          {/* Ngay sinh */}
          <div className="form-group">
            <label htmlFor="Ngay_sinh">
              Ngày sinh <span className="required">*</span>
            </label>
            <input
              type="date"
              id="Ngay_Sinh"
              name="Ngay_Sinh"
              onChange={handleChange}
              className={errors.Ngay_Sinh ? 'input-error' : ''}
            />
            {errors.Ngay_Sinh && (
              <span className="error-message">{errors.Ngay_Sinh}</span>
            )}
          </div>

          {/* Ma_Nhan_Vien_quan_li */}
          <div className="form-group">
            <label htmlFor="Ma_Nhan_Vien_quan_li">
              Mã nhân viên quản lí <span className="required">*</span>
            </label>
            <input
              type="text"
              id="Ma_Nhan_Vien_quan_li"
              name="Ma_Nhan_Vien_quan_li"
              value={formData.Ma_Nhan_Vien_quan_li}
              onChange={handleChange}
              className={errors.Ma_Nhan_Vien_quan_li ? 'input-error' : ''}
            />
            {errors.Ma_Nhan_Vien_quan_li && (
              <span className="error-message">{errors.Ma_Nhan_Vien_quan_li}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="Trang_Thai">
              Trạng thái <span className="required">*</span>
            </label>
            <select
              id="Trang_Thai"
              name="Trang_Thai"
              value={formData.Trang_Thai}
              onChange={handleChange}
            >
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
              <option value="Tạm nghỉ">Tạm nghỉ</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;