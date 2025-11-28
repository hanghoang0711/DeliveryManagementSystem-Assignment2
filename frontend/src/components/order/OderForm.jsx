import { useState, useEffect } from 'react';
import { ORDER_STATUSES, STATUS_WORKFLOW } from '../../utils/constants';
import '../../components/order/OderForm.css';

const OrderForm = ({ order, onSubmit, onClose }) => {
  // Form state
  let now = new Date();
  now.setDate(now.getDate() + 3);

  const [formData, setFormData] = useState({
    Ma_khach_hang: '',
    dia_chi_lay_hang: '',
    dia_chi_giao_hang: '',
    SDT_nguoi_nhan: '',
    ten_nguoi_nhan: '',
    gia_tri_hang_hoa_phi_van_chuyen: 0,
    can_nang: 0,
    phuong_thuc_giao_hang: '',
    Trang_thai_don: 'Đang xử lý',
    Thoi_gian_giao_hang_du_kien: now
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!order;

  // Load order data khi edit mode
  useEffect(() => {
    if (order) {
      console.log(order);

      setFormData({
        Ma_khach_hang: order.Ma_khach_hang || '',
        dia_chi_lay_hang: order.dia_chi_lay_hang || '',
        dia_chi_giao_hang: order.dia_chi_giao_hang || '',
        SDT_nguoi_nhan: order.SDT_nguoi_nhan || '',
        ten_nguoi_nhan: order.ten_nguoi_nhan || '',
        gia_tri_hang_hoa_phi_van_chuyen: order.gia_tri_hang_hoa_phi_van_chuyen || 0,
        can_nang: order.can_nang || '',
        phuong_thuc_giao_hang: order.phuong_thuc_giao_hang || '',
        Trang_thai_don: order.Trang_thai_don || 'Đang xử lý',
        Thoi_gian_giao_hang_du_kien: order.Thoi_gian_giao_hang_du_kien || '',
      });
    }
  }, [order]);

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

    console.log(formData);

    if (!formData.Ma_khach_hang.trim()) {
      newErrors.Ma_khach_hang = 'Mã khách hàng không được để trống';
    }

    if (!formData.dia_chi_lay_hang.trim()) {
      newErrors.dia_chi_lay_hang = 'Địa chỉ lấy hàng không được để trống';
    }

    if (!formData.dia_chi_giao_hang.trim()) {
      newErrors.dia_chi_giao_hang = 'Địa chỉ giao hàng không được để trống';
    } 

    if (!formData.SDT_nguoi_nhan.trim()) {
      newErrors.SDT_nguoi_nhan = 'SĐT người nhận không được để trống';
    } else if (!/^0\d{9}$/.test(formData.SDT_nguoi_nhan)) {
      newErrors.SDT_nguoi_nhan = 'SĐT phải có 10 chữ số và bắt đầu bằng 0';
    }

    if (!formData.ten_nguoi_nhan.trim()) {
      newErrors.ten_nguoi_nhan = 'Tên người nhận không được để trống';
    }

    if (formData.gia_tri_hang_hoa_phi_van_chuyen <= 0) {
      newErrors.gia_tri_hang_hoa_phi_van_chuyen = 'Giá trị hàng hóa phải lớn hơn 0';
    }

    if (formData.can_nang <= 0) {
      newErrors.can_nang = 'Cân nặng hàng hóa phải lớn hơn 0';
    }

    if (!formData.phuong_thuc_giao_hang.trim()) {
      newErrors.phuong_thuc_giao_hang = 'Cần cho biết phương thức giao hàng';
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
      // Convert string to number for numeric fields
      const submitData = {
        ...formData,
        gia_tri_hang_hoa_phi_van_chuyen: parseFloat(formData.gia_tri_hang_hoa_phi_van_chuyen)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Get available next statuses (for edit mode)
   */
  const getAvailableStatuses = () => {
    if (!isEditMode) {
      return ['Đang xử lý']; // Only default status for new order
    }
    
    const currentStatus = order.Trang_thai_don;
    const nextStatuses = STATUS_WORKFLOW[currentStatus] || [];
    
    // Include current status + next possible statuses
    return [currentStatus, ...nextStatuses];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>
            {isEditMode ? '✏️ Cập nhật đơn hàng' : '➕ Tạo đơn hàng mới'}
          </h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-grid">
            {/* Column 1: Customer & Addresses */}
            <div className="form-section">
              {/* Customer ID */}
              <div className="form-group">
                <label htmlFor="Ma_khach_hang">
                  Mã khách hàng <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="Ma_khach_hang"
                  name="Ma_khach_hang"
                  value={formData.Ma_khach_hang}
                  onChange={handleChange}
                  placeholder="KH001"
                  disabled={isEditMode} // Can't change customer in edit mode
                  className={errors.Ma_khach_hang ? 'input-error' : ''}
                />
                {errors.Ma_khach_hang && (
                  <span className="error-message">{errors.Ma_khach_hang}</span>
                )}
              </div>

              {/* Pickup Address */}
              <div className="form-group">
                <label htmlFor="dia_chi_lay_hang">
                  Địa chỉ lấy hàng <span className="required">*</span>
                </label>
                <textarea
                  id="dia_chi_lay_hang"
                  name="dia_chi_lay_hang"
                  value={formData.dia_chi_lay_hang}
                  onChange={handleChange}
                  placeholder="123 Nguyễn Văn Cừ, Q5, TP.HCM"
                  rows="2"
                  disabled={isEditMode}
                  className={errors.dia_chi_lay_hang ? 'input-error' : ''}
                />
                {errors.dia_chi_lay_hang && (
                  <span className="error-message">{errors.dia_chi_lay_hang}</span>
                )}
              </div>

              {/* Delivery Address */}
              <div className="form-group">
                <label htmlFor="dia_chi_giao_hang">
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <textarea
                  id="dia_chi_giao_hang"
                  name="dia_chi_giao_hang"
                  value={formData.dia_chi_giao_hang}
                  onChange={handleChange}
                  placeholder="456 Lê Lợi, Q1, TP.HCM"
                  rows="2"
                  disabled={isEditMode}
                  className={errors.dia_chi_giao_hang ? 'input-error' : ''}
                />
                {errors.dia_chi_giao_hang && (
                  <span className="error-message">{errors.dia_chi_giao_hang}</span>
                )}
              </div>
            </div>

                
            <div className='form-section'>
              {/* Receiver Phone */}
              <div className="form-group">
                <label htmlFor="SDT_nguoi_nhan">
                  SĐT người nhận <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="SDT_nguoi_nhan"
                  name="SDT_nguoi_nhan"
                  value={formData.SDT_nguoi_nhan}
                  onChange={handleChange}
                  placeholder="0907654321"
                  maxLength="10"
                  className={errors.SDT_nguoi_nhan ? 'input-error' : ''}
                />
                {errors.SDT_nguoi_nhan && (
                  <span className="error-message">{errors.SDT_nguoi_nhan}</span>
                )}
              </div>

              {/* Receiver Name */}
              <div className="form-group">
                <label htmlFor="ten_nguoi_nhan">
                  Tên người nhận <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ten_nguoi_nhan"
                  name="ten_nguoi_nhan"
                  value={formData.ten_nguoi_nhan}
                  onChange={handleChange}
                  placeholder="Trần Thị B"
                  className={errors.ten_nguoi_nhan ? 'input-error' : ''}
                />
                {errors.ten_nguoi_nhan && (
                  <span className="error-message">{errors.ten_nguoi_nhan}</span>
                )}
              </div>
            </div>

          </div>


          {/* Package Value */}
          <div className="form-group">
            <label htmlFor="gia_tri_hang_hoa_phi_van_chuyen">
              Giá trị hàng hóa (VNĐ) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="gia_tri_hang_hoa_phi_van_chuyen"
              name="gia_tri_hang_hoa_phi_van_chuyen"
              value={formData.gia_tri_hang_hoa_phi_van_chuyen}
              onChange={handleChange}
              min="0"
              step="1000"
              disabled={isEditMode}
              className={errors.gia_tri_hang_hoa_phi_van_chuyen ? 'input-error' : ''}
            />
            {errors.gia_tri_hang_hoa_phi_van_chuyen && (
              <span className="error-message">{errors.gia_tri_hang_hoa_phi_van_chuyen}</span>
            )}
            <small className="help-text">
              Backend sẽ tự động tính phí vận chuyển dựa trên quãng đường
            </small>
          </div>

          {/* Package Weight */}
          <div className="form-group">
            <label htmlFor="can_nang">
              Cân nặng hàng hoá (Kg) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="can_nang"
              name="can_nang"
              value={formData.can_nang}
              onChange={handleChange}
              min="0"
              step="1"
              disabled={isEditMode}
              className={errors.can_nang ? 'input-error' : ''}
            />
            {errors.can_nang && (
              <span className="error-message">{errors.can_nang}</span>
            )}
          </div>

          {/* Delivery method */}
          <div className="form-group">
            <label htmlFor="phuong_thuc_giao_hang">
              Phương thức giao hàng <span className="required">*</span>
            </label>
            <input
              type="text"
              id="phuong_thuc_giao_hang"
              name="phuong_thuc_giao_hang"
              value={formData.phuong_thuc_giao_hang}
              onChange={handleChange}
              disabled={isEditMode}
              className={errors.phuong_thuc_giao_hang ? 'input-error' : ''}
            />
            {errors.phuong_thuc_giao_hang && (
              <span className="error-message">{errors.phuong_thuc_giao_hang}</span>
            )}
          </div>

          {/* Status (Edit mode only) */}
          {isEditMode && (
            <div className="form-group">
              <label htmlFor="Trang_thai_don">
                Trạng thái <span className="required">*</span>
              </label>
              <select
                id="Trang_thai_don"
                name="Trang_thai_don"
                value={formData.Trang_thai_don}
                onChange={handleChange}
              >
                {getAvailableStatuses().map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <small className="help-text">
                Chỉ có thể chuyển sang trạng thái hợp lệ tiếp theo
              </small>
            </div>
          )}

          {/* Info Box for New Order */}
          {!isEditMode && (
            <div className="info-box">
              <strong>ℹ️ Lưu ý:</strong>
              <ul>
                <li>Backend sẽ tự động tính <strong>quãng đường</strong> (km)</li>
                <li>Phí vận chuyển = quãng đường × 15,000 VNĐ/km</li>
                <li>Mã đơn hàng sẽ được tạo tự động (DHxxxx)</li>
                <li>Trạng thái mặc định: "Đang xử lý"</li>
              </ul>
            </div>
          )}

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
              {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo đơn hàng')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;