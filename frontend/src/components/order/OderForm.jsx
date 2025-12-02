import { useState, useEffect } from 'react';
import { ORDER_STATUSES, STATUS_WORKFLOW } from '../../utils/constants';
import './OderForm.css'; // Import CSS mới

// Import Feather Icons
import { X, Save, Edit2, Plus, MapPin, Phone, User, Package, Info, FileText } from 'react-feather';

const OrderForm = ({ order, onSubmit, onClose }) => {
  // ... (Giữ nguyên logic state cũ của bạn) ...
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
    Thoi_gian_giao_hang_du_kien: new Date(new Date().setDate(new Date().getDate() + 3)) // Logic ngày + 3
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!order;

  useEffect(() => {
    if (order) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.Ma_khach_hang.trim()) newErrors.Ma_khach_hang = 'Mã khách hàng không được để trống';
    if (!formData.dia_chi_lay_hang.trim()) newErrors.dia_chi_lay_hang = 'Địa chỉ lấy hàng không được để trống';
    if (!formData.dia_chi_giao_hang.trim()) newErrors.dia_chi_giao_hang = 'Địa chỉ giao hàng không được để trống';
    if (!formData.SDT_nguoi_nhan.trim()) newErrors.SDT_nguoi_nhan = 'SĐT người nhận không được để trống';
    else if (!/^0\d{9}$/.test(formData.SDT_nguoi_nhan)) newErrors.SDT_nguoi_nhan = 'SĐT phải có 10 chữ số';
    if (!formData.ten_nguoi_nhan.trim()) newErrors.ten_nguoi_nhan = 'Tên người nhận không được để trống';
    if (formData.gia_tri_hang_hoa_phi_van_chuyen <= 0) newErrors.gia_tri_hang_hoa_phi_van_chuyen = 'Giá trị hàng hóa phải > 0';
    if (formData.can_nang <= 0) newErrors.can_nang = 'Cân nặng phải > 0';
    if (!formData.phuong_thuc_giao_hang.trim()) newErrors.phuong_thuc_giao_hang = 'Chọn phương thức giao hàng';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        gia_tri_hang_hoa_phi_van_chuyen: parseFloat(formData.gia_tri_hang_hoa_phi_van_chuyen)
      };
      await onSubmit(submitData);
    } catch (error) { console.error('Submit error:', error); } 
    finally { setSubmitting(false); }
  };

  const getAvailableStatuses = () => {
    if (!isEditMode) return ['Đang xử lý'];
    const currentStatus = order.Trang_thai_don;
    const nextStatuses = STATUS_WORKFLOW[currentStatus] || [];
    return [currentStatus, ...nextStatuses];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isEditMode ? <Edit2 size={22} color="#3B5998" /> : <Plus size={22} color="#3B5998" />}
            {isEditMode ? ' Cập nhật đơn hàng' : ' Tạo đơn hàng mới'}
          </h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-grid">
            
            {/* Cột 1 */}
            <div className="form-section">
              <h3><User size={18}/> Thông tin chung</h3>
              
              <div className="form-group">
                <label>Mã khách hàng <span className="required">*</span></label>
                <input type="text" name="Ma_khach_hang" value={formData.Ma_khach_hang} onChange={handleChange} placeholder="KH001" disabled={isEditMode} className={errors.Ma_khach_hang ? 'input-error' : ''} />
                {errors.Ma_khach_hang && <span className="error-message">{errors.Ma_khach_hang}</span>}
              </div>

              <div className="form-group">
                <label>Địa chỉ lấy hàng <span className="required">*</span></label>
                <textarea name="dia_chi_lay_hang" value={formData.dia_chi_lay_hang} onChange={handleChange} placeholder="Nhập địa chỉ lấy..." rows="2" disabled={isEditMode} className={errors.dia_chi_lay_hang ? 'input-error' : ''} />
                {errors.dia_chi_lay_hang && <span className="error-message">{errors.dia_chi_lay_hang}</span>}
              </div>

              <div className="form-group">
                <label>Địa chỉ giao hàng <span className="required">*</span></label>
                <textarea name="dia_chi_giao_hang" value={formData.dia_chi_giao_hang} onChange={handleChange} placeholder="Nhập địa chỉ giao..." rows="2" disabled={isEditMode} className={errors.dia_chi_giao_hang ? 'input-error' : ''} />
                {errors.dia_chi_giao_hang && <span className="error-message">{errors.dia_chi_giao_hang}</span>}
              </div>
            </div>

            {/* Cột 2 */}
            <div className="form-section">
              <h3><Package size={18}/> Người nhận & Hàng hóa</h3>

              <div className="form-row">
                  <div className="form-group">
                    <label>SĐT người nhận <span className="required">*</span></label>
                    <input type="tel" name="SDT_nguoi_nhan" value={formData.SDT_nguoi_nhan} onChange={handleChange} placeholder="090xxx" maxLength="10" className={errors.SDT_nguoi_nhan ? 'input-error' : ''} />
                  </div>
                  <div className="form-group">
                    <label>Tên người nhận <span className="required">*</span></label>
                    <input type="text" name="ten_nguoi_nhan" value={formData.ten_nguoi_nhan} onChange={handleChange} placeholder="Nguyễn Văn B" className={errors.ten_nguoi_nhan ? 'input-error' : ''} />
                  </div>
              </div>

              <div className="form-row">
                  <div className="form-group">
                    <label>Giá trị (VNĐ) <span className="required">*</span></label>
                    <input type="number" name="gia_tri_hang_hoa_phi_van_chuyen" value={formData.gia_tri_hang_hoa_phi_van_chuyen} onChange={handleChange} min="0" step="1000" disabled={isEditMode} className={errors.gia_tri_hang_hoa_phi_van_chuyen ? 'input-error' : ''} />
                  </div>
                  <div className="form-group">
                    <label>Cân nặng (kg) <span className="required">*</span></label>
                    <input type="number" name="can_nang" value={formData.can_nang} onChange={handleChange} min="0" step="0.1" disabled={isEditMode} className={errors.can_nang ? 'input-error' : ''} />
                  </div>
              </div>

              <div className="form-group">
                <label>Phương thức giao <span className="required">*</span></label>
                <input type="text" name="phuong_thuc_giao_hang" value={formData.phuong_thuc_giao_hang} onChange={handleChange} placeholder="Ví dụ: Đường bộ" disabled={isEditMode} className={errors.phuong_thuc_giao_hang ? 'input-error' : ''} />
              </div>

              {isEditMode && (
                <div className="form-group">
                  <label>Trạng thái <span className="required">*</span></label>
                  <select name="Trang_thai_don" value={formData.Trang_thai_don} onChange={handleChange}>
                    {getAvailableStatuses().map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {!isEditMode && (
            <div className="info-box">
              <strong><Info size={16} /> Thông tin tự động:</strong>
              <ul>
                <li>Mã đơn hàng sẽ được tạo tự động (DHxxxx).</li>
                <li>Phí vận chuyển tính dựa trên quãng đường.</li>
                <li>Trạng thái mặc định: "Đang xử lý".</li>
              </ul>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {isEditMode ? <Save size={18}/> : <Plus size={18}/>}
              {submitting ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo đơn hàng')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;