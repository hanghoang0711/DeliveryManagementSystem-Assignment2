import { X, Truck, User, MapPin, Calendar, Package, CheckCircle, Clock, TrendingUp } from 'react-feather';
import './TripDetailsModal.css';

const TripDetailsModal = ({ trip, onClose }) => {
  if (!trip) return null;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Đang thực hiện': '#2196F3',
      'Hoàn thành': '#4CAF50',
      'Đã hủy': '#F44336'
    };
    return colors[status] || '#757575';
  };

  const getOrderStatusColor = (status) => {
    const colors = {
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
    return colors[status] || '#757575';
  };

  const totalDistance = trip.donHangs?.reduce((sum, order) => {
    return sum + (parseFloat(order.quang_duong) || 0);
  }, 0) || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="trip-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Truck size={24} color="white" />
            Chi tiết chuyến: {trip.DeliveryID}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status & Summary */}
          <div className="trip-summary">
            <div className="status-section">
              <span 
                className="status-badge-large"
                style={{ 
                  backgroundColor: `${getStatusColor(trip.TrangThaiChuyen)}20`,
                  color: getStatusColor(trip.TrangThaiChuyen),
                  border: `2px solid ${getStatusColor(trip.TrangThaiChuyen)}`
                }}
              >
                <CheckCircle size={18} />
                {trip.TrangThaiChuyen}
              </span>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <Package size={24} color="#3B5998" />
                <div className="card-content">
                  <span className="card-label">Số đơn hàng</span>
                  <span className="card-value">{trip.so_luong_don_gop || trip.donHangs?.length || 0}</span>
                </div>
              </div>
              <div className="summary-card">
                <MapPin size={24} color="#059669" />
                <div className="card-content">
                  <span className="card-label">Tổng quãng đường</span>
                  <span className="card-value">{totalDistance.toFixed(2)} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin tài xế */}
          <section className="detail-section">
            <h3><User size={20} /> Tài xế phụ trách</h3>
            <div className="driver-info-card">
              <div className="driver-avatar">
                <User size={32} />
              </div>
              <div className="driver-details">
                <div className="driver-name">{trip.taiXe?.Ho_ten || 'N/A'}</div>
                <div className="driver-meta">
                  <span className="driver-id">ID: {trip.DriverID}</span>
                  {trip.taiXe?.Rating && (
                    <span className="driver-rating">
                      ⭐ {trip.taiXe.Rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Thông tin chuyến */}
          <section className="detail-section">
            <h3><Calendar size={20} /> Thông tin chuyến</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Mã chuyến:</label>
                <span className="highlight-text">{trip.DeliveryID}</span>
              </div>
              <div className="detail-item">
                <label>Số lượng đơn gộp:</label>
                <span>{trip.so_luong_don_gop || 0}</span>
              </div>
            </div>
          </section>

          {/* Danh sách đơn hàng */}
          {trip.donHangs && trip.donHangs.length > 0 && (
            <section className="detail-section">
              <h3><Package size={20} /> Danh sách đơn hàng ({trip.donHangs.length})</h3>
              <div className="orders-list">
                {trip.donHangs.map((order, index) => (
                  <div key={index} className="order-card">
                    <div className="order-header">
                      <div className="order-id-section">
                        <Package size={18} color="#3B5998" />
                        <span className="order-id">{order.Ma_don_hang}</span>
                      </div>
                      <span 
                        className="order-status-badge"
                        style={{
                          backgroundColor: `${getOrderStatusColor(order.Trang_thai_don)}20`,
                          color: getOrderStatusColor(order.Trang_thai_don)
                        }}
                      >
                        {order.Trang_thai_don}
                      </span>
                    </div>

                    <div className="order-details">
                      {order.dia_chi_lay_hang && (
                        <div className="order-address">
                          <MapPin size={14} color="#059669" />
                          <div>
                            <small>Lấy hàng:</small>
                            <span>{order.dia_chi_lay_hang}</span>
                          </div>
                        </div>
                      )}
                      {order.dia_chi_giao_hang && (
                        <div className="order-address">
                          <MapPin size={14} color="#dc2626" />
                          <div>
                            <small>Giao hàng:</small>
                            <span>{order.dia_chi_giao_hang}</span>
                          </div>
                        </div>
                      )}

                      <div className="order-meta">
                        {order.quang_duong && (
                          <div className="meta-item">
                            <TrendingUp size={14} />
                            <span>{order.quang_duong} km</span>
                          </div>
                        )}
                        {order.ten_nguoi_nhan && (
                          <div className="meta-item">
                            <User size={14} />
                            <span>{order.ten_nguoi_nhan}</span>
                          </div>
                        )}
                        {order.SDT_nguoi_nhan && (
                          <div className="meta-item">
                            📞 {order.SDT_nguoi_nhan}
                          </div>
                        )}
                      </div>

                      {/* Thông tin gộp đơn từ bảng trung gian */}
                      {order.DON_HANG_DUOC_GIAO && (
                        <div className="delivery-info">
                          <div className="delivery-detail">
                            <label>Thứ tự lấy hàng:</label>
                            <span className="sequence-badge">{order.DON_HANG_DUOC_GIAO.Thu_tu_lay_hang}</span>
                          </div>
                          <div className="delivery-detail">
                            <label>Thứ tự giao hàng:</label>
                            <span className="sequence-badge">{order.DON_HANG_DUOC_GIAO.Thu_tu_giao_hang}</span>
                          </div>
                          {order.DON_HANG_DUOC_GIAO.Thoi_diem_gop_don && (
                            <div className="delivery-detail full-width">
                              <label>Thời điểm gộp đơn:</label>
                              <span>{formatDateTime(order.DON_HANG_DUOC_GIAO.Thoi_diem_gop_don)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trường hợp chưa có đơn hàng */}
          {(!trip.donHangs || trip.donHangs.length === 0) && (
            <div className="empty-orders">
              <Package size={48} color="#cbd5e1" />
              <p>Chuyến chưa có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
