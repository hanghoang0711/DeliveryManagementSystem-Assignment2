import { useState } from 'react';
import './TripForm.css';

// Import Feather Icons
import { X, Truck, Info, Plus } from 'react-feather';

const TripForm = ({ onSubmit, onCancel }) => {
  // Logic cũ của bạn (giữ nguyên state tên là DriverID)
  const [formData, setFormData] = useState({
    DriverID: '',
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

    if (!formData.DriverID.trim()) {
      newErrors.DriverID = 'Mã tài xế không được để trống';
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

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content trip-form-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header với Icon */}
        <div className="modal-header">
          <h2>
             <Truck size={22} color="#3B5998" /> 
             Tạo chuyến giao hàng mới
          </h2>
          <button className="btn-close" onClick={handleClose} type="button">
             <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
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
              placeholder="Ví dụ: DRV001"
              className={errors.DriverID ? 'input-error' : ''}
            />
            {errors.DriverID && (
              <span className="error-message">{errors.DriverID}</span>
            )}
          </div>

          {/* Info Box với Icon */}
          <div className="info-box">
            <strong><Info size={16} /> Lưu ý:</strong>
            <ul>
              <li>Mã chuyến sẽ được tạo tự động (CGxxxx)</li>
              <li>Trạng thái mặc định: "Đang thực hiện"</li>
              <li>Sau khi tạo, bạn có thể thêm đơn hàng vào chuyến</li>
              <li>Tổng quãng đường sẽ được tính tự động khi thêm đơn</li>
            </ul>
          </div>

          {/* Actions với Icon */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              <Plus size={18} />
              {submitting ? 'Đang tạo...' : 'Tạo chuyến'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;