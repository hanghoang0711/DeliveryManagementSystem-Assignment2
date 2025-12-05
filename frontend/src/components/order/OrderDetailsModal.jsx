import { X, Package, User, MapPin, Calendar, DollarSign, TrendingUp, Tag, AlertCircle } from 'react-feather';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Đang xử lý': '#FFA500',
      'Đang tìm tài xế': '#2196F3',
      'Đã tìm được tài xế': '#4CAF50',
      'Đang lấy hàng': '#FF9800',
      'Lấy hàng thành công': '#8BC34A',
      'Đang giao hàng': '#3F51B5',
      'Giao hàng thành công': '#4CAF50',
      'Đã hoàn thành': '#2E7D32',
      'Đã hủy': '#F44336'
    };
    return statusColors[status] || '#757575';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Package size={24} color="#3B5998" />
            Chi tiết đơn hàng: {order.Ma_don_hang}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Badge */}
          <div className="status-section">
            <span 
              className="status-badge-large"
              style={{ 
                backgroundColor: `${getStatusColor(order.Trang_thai_don)}20`,
                color: getStatusColor(order.Trang_thai_don),
                border: `2px solid ${getStatusColor(order.Trang_thai_don)}`
              }}
            >
              <AlertCircle size={18} />
              {order.Trang_thai_don}
            </span>
          </div>

          {/* Thông tin khách hàng */}
          <section className="detail-section">
            <h3><User size={20} /> Thông tin khách hàng</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Mã khách hàng:</label>
                <span>{order.Ma_khach_hang || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Tên người nhận:</label>
                <span>{order.ten_nguoi_nhan || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>SĐT người nhận:</label>
                <span>{order.SDT_nguoi_nhan || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Địa chỉ */}
          <section className="detail-section">
            <h3><MapPin size={20} /> Địa chỉ</h3>
            <div className="detail-grid">
              <div className="detail-item full-width">
                <label>Địa chỉ lấy hàng:</label>
                <span>{order.dia_chi_lay_hang || 'N/A'}</span>
              </div>
              <div className="detail-item full-width">
                <label>Địa chỉ giao hàng:</label>
                <span>{order.dia_chi_giao_hang || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Quãng đường:</label>
                <span>{order.quang_duong ? `${order.quang_duong} km` : 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Thời gian */}
          <section className="detail-section">
            <h3><Calendar size={20} /> Thời gian</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Thời gian đặt:</label>
                <span>{formatDateTime(order.thoi_gian_dat_don)}</span>
              </div>
              <div className="detail-item">
                <label>Dự kiến lấy hàng:</label>
                <span>{formatDateTime(order.Thoi_gian_lay_hang_du_kien)}</span>
              </div>
              <div className="detail-item">
                <label>Dự kiến giao hàng:</label>
                <span>{formatDateTime(order.Thoi_gian_giao_hang_du_kien)}</span>
              </div>
            </div>
          </section>

          {/* Chi phí */}
          <section className="detail-section">
            <h3><DollarSign size={20} /> Chi phí</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Giá trị hàng hóa:</label>
                <span className="amount">{formatCurrency(order.gia_tri_hang_hoa_phi_van_chuyen)}</span>
              </div>
              <div className="detail-item">
                <label>Phí vận chuyển gốc:</label>
                <span className="amount">{formatCurrency(order.phi_van_chuyen_goc)}</span>
              </div>
              <div className="detail-item">
                <label>Số tiền được giảm:</label>
                <span className="amount discount">{formatCurrency(order.so_tien_duoc_giam)}</span>
              </div>
              <div className="detail-item">
                <label>Phí sau giảm:</label>
                <span className="amount">{formatCurrency(order.phi_van_chuyen_sau_giam)}</span>
              </div>
              <div className="detail-item highlight">
                <label>Tổng thanh toán:</label>
                <span className="amount total">
                  {formatCurrency(order.phi_van_chuyen_sau_giam)}
                </span>
              </div>
            </div>
          </section>

          {/* Khuyến mãi */}
          {(order.Ma_khuyen_mai_CT || order.Ma_khuyen_mai_KM || order.Ma_giam_gia) && (
            <section className="detail-section">
              <h3><Tag size={20} /> Khuyến mãi</h3>
              <div className="detail-grid">
                {order.Ma_khuyen_mai_CT && (
                  <div className="detail-item">
                    <label>Mã KM cộng tác:</label>
                    <span className="promo-code">{order.Ma_khuyen_mai_CT}</span>
                  </div>
                )}
                {order.Ma_khuyen_mai_KM && (
                  <div className="detail-item">
                    <label>Mã KM khác:</label>
                    <span className="promo-code">{order.Ma_khuyen_mai_KM}</span>
                  </div>
                )}
                {order.Ma_giam_gia && (
                  <div className="detail-item">
                    <label>Mã giảm giá:</label>
                    <span className="promo-code">{order.Ma_giam_gia}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Thông tin bổ sung */}
          {order.ghi_chu && (
            <section className="detail-section">
              <h3><TrendingUp size={20} /> Ghi chú</h3>
              <div className="note-box">
                {order.ghi_chu}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
