import { useState } from 'react';
import './AddOrderToTripForm.css';

const AddOrderToTripForm = ({ trip, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_don_hang: '',
    thu_tu_lay_hang: 1,
    thu_tu_giao_hang: 1
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

    if (!formData.ma_don_hang.trim()) {
      newErrors.ma_don_hang = 'Mã đơn hàng không được để trống';
    } else if (!/^DH\d{4}$/.test(formData.ma_don_hang)) {
      newErrors.ma_don_hang = 'Mã đơn hàng phải có định dạng DHxxxx (ví dụ: DH0001)';
    }

    if (formData.thu_tu_lay_hang < 1) {
      newErrors.thu_tu_lay_hang = 'Thứ tự lấy hàng phải >= 1';
    }

    if (formData.thu_tu_giao_hang < 1) {
      newErrors.thu_tu_giao_hang = 'Thứ tự giao hàng phải >= 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const submitData = {
        ma_don_hang: formData.ma_don_hang,
        thu_tu_lay_hang: parseInt(formData.thu_tu_lay_hang),
        thu_tu_giao_hang: parseInt(formData.thu_tu_giao_hang)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-order-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Thêm đơn hàng vào chuyến</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        <form onSubmit={handleSubmit} className="add-order-form">
          {/* Trip Info */}
          <div className="trip-info-box">
            <p><strong>Chuyến:</strong> {trip.Ma_chuyen_giao_hang}</p>
            <p><strong>Tài xế:</strong> {trip.ma_tai_xe}</p>
            <p><strong>Số đơn hiện tại:</strong> {trip.orderCount || 0} đơn</p>
          </div>

          {/* Order ID */}
          <div className="form-group">
            <label htmlFor="ma_don_hang">
              Mã đơn hàng <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ma_don_hang"
              name="ma_don_hang"
              value={formData.ma_don_hang}
              onChange={handleChange}
              placeholder="DH0001"
              className={errors.ma_don_hang ? 'input-error' : ''}
            />
            {errors.ma_don_hang && (
              <span className="error-message">{errors.ma_don_hang}</span>
            )}
          </div>

          {/* Pickup Order */}
          <div className="form-group">
            <label htmlFor="thu_tu_lay_hang">
              Thứ tự lấy hàng <span className="required">*</span>
            </label>
            <input
              type="number"
              id="thu_tu_lay_hang"
              name="thu_tu_lay_hang"
              value={formData.thu_tu_lay_hang}
              onChange={handleChange}
              min="1"
              className={errors.thu_tu_lay_hang ? 'input-error' : ''}
            />
            {errors.thu_tu_lay_hang && (
              <span className="error-message">{errors.thu_tu_lay_hang}</span>
            )}
            <small className="help-text">
              Thứ tự tài xế sẽ lấy hàng (1, 2, 3,...)
            </small>
          </div>

          {/* Delivery Order */}
          <div className="form-group">
            <label htmlFor="thu_tu_giao_hang">
              Thứ tự giao hàng <span className="required">*</span>
            </label>
            <input
              type="number"
              id="thu_tu_giao_hang"
              name="thu_tu_giao_hang"
              value={formData.thu_tu_giao_hang}
              onChange={handleChange}
              min="1"
              className={errors.thu_tu_giao_hang ? 'input-error' : ''}
            />
            {errors.thu_tu_giao_hang && (
              <span className="error-message">{errors.thu_tu_giao_hang}</span>
            )}
            <small className="help-text">
              Thứ tự tài xế sẽ giao hàng (1, 2, 3,...)
            </small>
          </div>

          {/* Info */}
          <div className="info-box">
            <strong>ℹ️ Lưu ý:</strong>
            <ul>
              <li>Đơn hàng phải có trạng thái "Đã tìm được tài xế"</li>
              <li>Backend sẽ tự động cập nhật tổng quãng đường của chuyến</li>
              <li>Thứ tự có thể trùng nhau (tùy thuộc lộ trình)</li>
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
              {submitting ? 'Đang thêm...' : 'Thêm đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderToTripForm;