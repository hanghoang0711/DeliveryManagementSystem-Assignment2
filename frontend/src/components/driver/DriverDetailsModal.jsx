import { X, User, Phone, CreditCard, Star, Award, Calendar, CheckCircle } from 'react-feather';
import './DriverDetailsModal.css';

const DriverDetailsModal = ({ driver, onClose }) => {
  if (!driver) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Đang hoạt động': '#4CAF50',
      'Tạm nghỉ': '#FFA500',
      'Đã nghỉ việc': '#F44336'
    };
    return colors[status] || '#757575';
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i < fullStars ? '#FFA500' : 'none'}
          color={i < fullStars ? '#FFA500' : '#cbd5e1'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="driver-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <User size={24} color="white" />
            Thông tin tài xế: {driver.Ho_ten}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-section">
              <div className="avatar">
                <User size={48} />
              </div>
              <div className="driver-basic-info">
                <h3>{driver.Ho_ten}</h3>
                <span className="driver-id">ID: {driver.DriverID}</span>
                <div className="rating">
                  {getRatingStars(driver.Rating)}
                  <span className="rating-value">{driver.Rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>
            <div className="status-badge-container">
              <span 
                className="status-badge-large"
                style={{ 
                  backgroundColor: `${getStatusColor(driver.Trang_Thai)}20`,
                  color: getStatusColor(driver.Trang_Thai),
                  border: `2px solid ${getStatusColor(driver.Trang_Thai)}`
                }}
              >
                <CheckCircle size={18} />
                {driver.Trang_Thai}
              </span>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <section className="detail-section">
            <h3><User size={20} /> Thông tin cá nhân</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Họ tên:</label>
                <span>{driver.Ho_ten}</span>
              </div>
              <div className="detail-item">
                <label>CCCD:</label>
                <span className="highlight-text">{driver.CCCD}</span>
              </div>
              <div className="detail-item">
                <label>Ngày sinh:</label>
                <span>{formatDateTime(driver.Ngay_Sinh)}</span>
              </div>
              <div className="detail-item">
                <label>Giới tính:</label>
                <span>{driver.Gioi_Tinh || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Ngày bắt đầu làm việc:</label>
                <span>{formatDateTime(driver.Ngay_Bat_Dau_Lam_Viec)}</span>
              </div>
            </div>
          </section>

          {/* Số điện thoại */}
          {driver.So_dien_thoai && driver.So_dien_thoai.length > 0 && (
            <section className="detail-section">
              <h3><Phone size={20} /> Số điện thoại</h3>
              <div className="phone-list">
                {driver.So_dien_thoai.map((phone, index) => (
                  <div key={index} className="phone-item">
                    <Phone size={16} />
                    <span>{phone}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Thông tin công việc */}
          <section className="detail-section">
            <h3><Award size={20} /> Thông tin công việc</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Mã nhân viên quản lý:</label>
                <span>{driver.Ma_Nhan_Vien_quan_li || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Ngày bắt đầu quản lý:</label>
                <span>{formatDateTime(driver.Ngay_Bat_Dau_Quan_Ly)}</span>
              </div>
              <div className="detail-item">
                <label>Rating:</label>
                <div className="rating-display">
                  {getRatingStars(driver.Rating)}
                  <span className="rating-number">{driver.Rating?.toFixed(2) || '0.00'} / 5.0</span>
                </div>
              </div>
            </div>
          </section>

          {/* Giấy phép lái xe */}
          {driver.GPLX && driver.GPLX.length > 0 && (
            <section className="detail-section">
              <h3><CreditCard size={20} /> Giấy phép lái xe</h3>
              <div className="license-grid">
                {driver.GPLX.map((license, index) => (
                  <div key={index} className="license-card">
                    <div className="license-type">{license.Loai_GPLX}</div>
                    <div className="license-info">
                      <div className="license-detail">
                        <label>Ngày cấp:</label>
                        <span>{formatDateTime(license.Ngay_cap)}</span>
                      </div>
                      <div className="license-detail">
                        <label>Ngày hết hạn:</label>
                        <span>{formatDateTime(license.Ngay_het_han)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ghi chú */}
          {driver.Ghi_chu && (
            <section className="detail-section">
              <h3><Calendar size={20} /> Ghi chú</h3>
              <div className="note-box">
                {driver.Ghi_chu}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
