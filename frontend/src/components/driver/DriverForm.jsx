import { useState, useEffect } from 'react';
import './DriverForm.css';

// Import Feather Icons
import { X, User, Save, Edit2, Plus } from 'react-feather';

const DriverForm = ({ driver, onSubmit, onClose }) => {
  // Form state (Giữ nguyên)
  const [formData, setFormData] = useState({
    Ho_ten: '',
    CCCD: '',
    Ngay_Sinh: new Date().toISOString().split('T')[0], // Format date chuẩn HTML input
    Ngay_Bat_Dau_Lam_Viec: new Date().toISOString().split('T')[0],
    Ma_Nhan_Vien_quan_li: '',
    Ngay_Bat_Dau_Quan_Ly: new Date().toISOString().split('T')[0],
    Trang_Thai: 'Đang hoạt động',
    Gioi_Tinh: 'Khác'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load data (Giữ nguyên logic)
  useEffect(() => {
    if (driver) {
      setFormData({
        Ho_ten: driver.Ho_ten || '',
        CCCD: driver.CCCD || '',
        Ngay_Sinh: driver.Ngay_Sinh ? new Date(driver.Ngay_Sinh).toISOString().split('T')[0] : '',
        Ngay_Bat_Dau_Lam_Viec: driver.Ngay_Bat_Dau_Lam_Viec ? new Date(driver.Ngay_Bat_Dau_Lam_Viec).toISOString().split('T')[0] : '',
        Ma_Nhan_Vien_quan_li: driver.Ma_Nhan_Vien_quan_li || '',
        Trang_Thai: driver.Trang_Thai || 'Đang hoạt động',
        Gioi_Tinh: driver.Gioi_Tinh || 'Khác'
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.Ho_ten.trim()) newErrors.Ho_ten = 'Họ tên không được để trống';
    else if (formData.Ho_ten.trim().length < 3) newErrors.Ho_ten = 'Họ tên phải có ít nhất 3 ký tự';

    if (!formData.CCCD.trim()) newErrors.CCCD = 'CCCD không được để trống';
    else if (!/^\d{12}$/.test(formData.CCCD)) newErrors.CCCD = 'CCCD phải có 12 chữ số';

    if (!formData.Ngay_Sinh) newErrors.Ngay_Sinh = 'Ngày sinh không được để trống';
    else if ((new Date()).getFullYear() - (new Date(formData.Ngay_Sinh)).getFullYear() < 18) {
      newErrors.Ngay_Sinh = 'Tài xế phải đủ 18 tuổi trở lên.';
    }

    if (!formData.Ma_Nhan_Vien_quan_li.trim()) newErrors.Ma_Nhan_Vien_quan_li = 'Mã NV quản lý không được trống';

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

  const isEditMode = !!driver;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header với Icon */}
        <div className="modal-header">
          <h2>
            {isEditMode ? <Edit2 size={20} color="#3B5998" style={{marginRight:'8px'}}/> : <Plus size={20} color="#3B5998" style={{marginRight:'8px'}}/>}
            {isEditMode ? 'Sửa thông tin tài xế' : 'Thêm tài xế mới'}
          </h2>
          <button className="btn-close" onClick={onClose}><X size={24}/></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="driver-form">

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="Ho_ten">Họ tên <span className="required">*</span></label>
            <input
              type="text"
              id="Ho_ten"
              name="Ho_ten"
              value={formData.Ho_ten}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={errors.Ho_ten ? 'input-error' : ''}
            />
            {errors.Ho_ten && <span className="error-message">{errors.Ho_ten}</span>}
          </div>

          {/* CCCD */}
          <div className="form-group">
            <label htmlFor="CCCD">CCCD <span className="required">*</span></label>
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
            {errors.CCCD && <span className="error-message">{errors.CCCD}</span>}
          </div>

          {/* Ngay sinh */}
          <div className="form-group">
            <label htmlFor="Ngay_Sinh">Ngày sinh <span className="required">*</span></label>
            <input
              type="date"
              id="Ngay_Sinh"
              name="Ngay_Sinh"
              value={formData.Ngay_Sinh}
              onChange={handleChange}
              className={errors.Ngay_Sinh ? 'input-error' : ''}
            />
            {errors.Ngay_Sinh && <span className="error-message">{errors.Ngay_Sinh}</span>}
          </div>

          {/* Ma_Nhan_Vien_quan_li */}
          <div className="form-group">
            <label htmlFor="Ma_Nhan_Vien_quan_li">Mã nhân viên quản lí <span className="required">*</span></label>
            <input
              type="text"
              id="Ma_Nhan_Vien_quan_li"
              name="Ma_Nhan_Vien_quan_li"
              value={formData.Ma_Nhan_Vien_quan_li}
              onChange={handleChange}
              className={errors.Ma_Nhan_Vien_quan_li ? 'input-error' : ''}
            />
            {errors.Ma_Nhan_Vien_quan_li && <span className="error-message">{errors.Ma_Nhan_Vien_quan_li}</span>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="Trang_Thai">Trạng thái <span className="required">*</span></label>
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

          {/* Sex */}
          <div className="form-group">
            <label htmlFor="Gioi_Tinh">Giới tính <span className="required">*</span></label>
            <select
              id="Gioi_Tinh"
              name="Gioi_Tinh"
              value={formData.Gioi_Tinh}
              onChange={handleChange}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
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