import { STATUS_COLORS, formatCurrency, formatDate, formatDistance } from '../../utils/constants';
import './OrderTable.css';

// Import Feather Icons
import { Eye, Edit, Trash2, User, MapPin, DollarSign, Clock, AlertCircle } from 'react-feather';

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
  
  /**
   * Get badge class theo trạng thái
   */
  const getStatusBadgeClass = (status) => {
    // Đảm bảo STATUS_COLORS trong file constants của bạn map đúng các trạng thái xấu về 'red'
    const color = STATUS_COLORS[status] || 'gray';
    return `badge-${color}`;
  };

  return (
    <div className="table-container">
      {orders.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th>Quãng đường</th>
                <th style={{textAlign: 'right'}}>Phí VC</th> {/* Căn phải tiêu đề tiền */}
                <th style={{textAlign: 'right'}}>Giá trị</th> {/* Căn phải tiêu đề tiền */}
                <th>Thời gian</th>
                <th style={{textAlign: 'right'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.Ma_don_hang}>
                  {/* Mã ĐH */}
                  <td>
                    <span className="order-id">{order.Ma_don_hang}</span>
                  </td>
                  
                  {/* Khách hàng (Cấu trúc mới để chống tràn) */}
                  <td style={{maxWidth: '250px'}}> {/* Ghi đè max-width cụ thể cho cột này nếu cần */}
                    <div className="customer-cell-wrapper">
                        <User size={16} color="#64748b" style={{flexShrink: 0}} /> {/* flexShrink: 0 để icon không bị bóp méo */}
                        <div className="customer-info-truncate">
                            {/* Thêm class text-truncate và title để hiển thị tooltip khi hover */}
                            <strong className="text-truncate" style={{color:'#1e293b'}} title={order.khachHang?.email}>
                                {order.khachHang?.email || 'N/A'}
                            </strong>
                            <small className="text-truncate" style={{color:'#64748b', display: 'block'}} title={order.Ma_khach_hang}>
                                {order.Ma_khach_hang}
                            </small>
                        </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.Trang_thai_don)}`}>
                      {order.Trang_thai_don}
                    </span>
                  </td>

                  {/* Quãng đường */}
                  <td>
                      <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#64748b'}}>
                          <MapPin size={12} style={{flexShrink: 0}} />
                          <span style={{whiteSpace: 'nowrap'}}>{formatDistance(order.quang_duong)}</span>
                      </div>
                  </td>

                  {/* Phí VC (Căn phải) */}
                  <td style={{textAlign: 'right'}}>
                    <div className="price-info">
                      <span className="original-price">
                        {formatCurrency(order.phi_van_chuyen_goc)}
                      </span>
                      {order.so_tien_duoc_giam > 0 && (
                         <span className="discount">-{formatCurrency(order.so_tien_duoc_giam)}</span>
                      )}
                      <span className="final-price">
                        {formatCurrency(order.phi_van_chuyen_sau_giam)}
                      </span>
                    </div>
                  </td>

                  {/* Giá trị (Căn phải) */}
                  <td style={{textAlign: 'right'}}>
                      <div style={{display:'inline-flex', alignItems:'center', gap:'4px', fontWeight:'600', color:'#334155'}}>
                          <DollarSign size={12} style={{flexShrink: 0}} />
                          {formatCurrency(order.gia_tri_hang_hoa_phi_van_chuyen)}
                      </div>
                  </td>

                  {/* Thời gian */}
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#64748b', fontSize:'13px'}}>
                        <Clock size={12} style={{flexShrink: 0}} />
                        <span style={{whiteSpace: 'nowrap'}}>{formatDate(order.thoi_gian_dat_don)}</span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action" onClick={() => onView(order)} title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      <button className="btn-action" onClick={() => onEdit(order)} title="Sửa">
                        <Edit size={16} />
                      </button>
                      <button className="btn-action delete" onClick={() => onDelete(order)} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : (
        <div className="empty-state">
            <AlertCircle size={48} color="#cbd5e1" strokeWidth={1} style={{marginBottom:'10px'}}/>
            <p>Chưa có đơn hàng nào</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;