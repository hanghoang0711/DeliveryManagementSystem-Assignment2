import { useState, useEffect } from 'react';
import './DriverForm.css';

const DriverForm = ({ driver, onSubmit, onClose }) => {
  // Form state
  const [formData, setFormData] = useState({
    DriverID: '',
    Ho_ten: '',
    CCCD: '',
    Rating: 4.0,
    Trang_thai_hoat_dong: 'Đang hoạt động'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load driver data khi edit mode
  useEffect(() => {
    if (driver) {
      setFormData({
        DriverID: driver.DriverID || '',
        Ho_ten: driver.Ho_ten || '',
        CCCD: driver.CCCD || '',
        Rating: driver.Rating || 4.0,
        Trang_thai_hoat_dong: driver.Trang_thai_hoat_dong || 'Đang hoạt động'
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

    if (!formData.DriverID.trim()) {
      newErrors.DriverID = 'Mã tài xế không được để trống';
    } else if (!/^DRV\d{3}$/.test(formData.DriverID)) {
      newErrors.DriverID = 'Mã tài xế phải có định dạng DRVxxx (ví dụ: DRV001)';
    }

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

    if (formData.Rating < 0 || formData.Rating > 5) {
      newErrors.Rating = 'Rating phải từ 0 đến 5';
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
          {/* Driver ID */}
          <div className="form-group">
            <label htmlFor="DriverID">
              Mã tài xế <span className="required">*</span>
            </label>
            <input
              type="text"
              id="DriverID"
              name="DriverID"
              value={formData.DriverID}
              onChange={handleChange}
              placeholder="DRV001"
              disabled={isEditMode} // Không cho edit ID
              className={errors.DriverID ? 'input-error' : ''}
            />
            {errors.DriverID && (
              <span className="error-message">{errors.DriverID}</span>
            )}
          </div>

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

          {/* Rating */}
          <div className="form-group">
            <label htmlFor="Rating">
              Rating (0-5) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="Rating"
              name="Rating"
              value={formData.Rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className={errors.Rating ? 'input-error' : ''}
            />
            {errors.Rating && (
              <span className="error-message">{errors.Rating}</span>
            )}
            <small className="help-text">Điểm đánh giá từ 0.0 đến 5.0</small>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="Trang_thai_hoat_dong">
              Trạng thái <span className="required">*</span>
            </label>
            <select
              id="Trang_thai_hoat_dong"
              name="Trang_thai_hoat_dong"
              value={formData.Trang_thai_hoat_dong}
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