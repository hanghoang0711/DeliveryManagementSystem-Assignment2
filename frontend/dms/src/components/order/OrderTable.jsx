import { STATUS_COLORS, formatCurrency, formatDate, formatDistance } from '../../utils/constants';
import './OrderTable.css';

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
  /**
   * Get badge class theo trạng thái
   */
  const getStatusBadgeClass = (status) => {
    const color = STATUS_COLORS[status] || 'gray';
    return `badge-${color}`;
  };

  return (
    <div className="table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>Trạng thái</th>
            <th>Quãng đường</th>
            <th>Phí VC</th>
            <th>Giá trị</th>
            <th>Thời gian</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.Ma_don_hang}>
              <td>
                <span className="order-id">{order.Ma_don_hang}</span>
              </td>
              <td>
                <strong>{order.khachHang?.email || 'N/A'}</strong>
                <br />
                <small>{order.Ma_khach_hang}</small>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(order.Trang_thai_don)}`}>
                  {order.Trang_thai_don}
                </span>
              </td>
              <td>{formatDistance(order.quang_duong)}</td>
              <td>
                <div className="price-info">
                  <span className="original-price">
                    {formatCurrency(order.phi_van_chuyen_goc)}
                  </span>
                  {order.so_tien_duoc_giam > 0 && (
                    <>
                      <span className="discount">
                        -{formatCurrency(order.so_tien_duoc_giam)}
                      </span>
                      <span className="final-price">
                        {formatCurrency(order.phi_van_chuyen_sau_giam)}
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td>{formatCurrency(order.gia_tri_hang_hoa_phi_van_chuyen)}</td>
              <td>
                <small>{formatDate(order.thoi_gian_dat_don)}</small>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-view"
                    onClick={() => onView(order)}
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(order)}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(order)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="empty-state">
          <p>Chưa có đơn hàng nào</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;