import { useState } from 'react';
import './TripForm.css';

const TripForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_tai_xe: '',
    ngay_bat_dau: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.ma_tai_xe.trim()) {
      newErrors.ma_tai_xe = 'Mã tài xế không được để trống';
    } else if (!/^TX\d{3}$/.test(formData.ma_tai_xe)) {
      newErrors.ma_tai_xe = 'Mã tài xế phải có định dạng TXxxx (ví dụ: TX001)';
    }

    if (!formData.ngay_bat_dau) {
      newErrors.ngay_bat_dau = 'Ngày bắt đầu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content trip-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚚 Tạo chuyến giao hàng mới</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          {/* Driver ID */}
          <div className="form-group">
            <label htmlFor="ma_tai_xe">
              Mã tài xế <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ma_tai_xe"
              name="ma_tai_xe"
              value={formData.ma_tai_xe}
              onChange={handleChange}
              placeholder="TX001"
              className={errors.ma_tai_xe ? 'input-error' : ''}
            />
            {errors.ma_tai_xe && (
              <span className="error-message">{errors.ma_tai_xe}</span>
            )}
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="ngay_bat_dau">
              Ngày bắt đầu <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="ngay_bat_dau"
              name="ngay_bat_dau"
              value={formData.ngay_bat_dau}
              onChange={handleChange}
              className={errors.ngay_bat_dau ? 'input-error' : ''}
            />
            {errors.ngay_bat_dau && (
              <span className="error-message">{errors.ngay_bat_dau}</span>
            )}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <strong>ℹ️ Lưu ý:</strong>
            <ul>
              <li>Mã chuyến sẽ được tạo tự động (CGxxxx)</li>
              <li>Trạng thái mặc định: "Đang thực hiện"</li>
              <li>Sau khi tạo, bạn có thể thêm đơn hàng vào chuyến</li>
              <li>Tổng quãng đường sẽ được tính tự động khi thêm đơn</li>
            </ul>
          </div>

          {/* Actions */}
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
              {submitting ? 'Đang tạo...' : 'Tạo chuyến'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;