import './DriverTable.css';

const DriverTable = ({ drivers, onEdit, onDelete }) => {
  /**
   * Format rating với sao
   */
  const formatRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return `${stars} ${rating.toFixed(1)}`;
  };

  /**
   * Get badge class theo trạng thái
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'badge-success';
      case 'Không hoạt động':
        return 'badge-danger';
      case 'Tạm nghỉ':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="table-container">
      <table className="driver-table">
        <thead>
          <tr>
            <th>Mã TXế</th>
            <th>Họ tên</th>
            <th>CCCD</th>
            <th>Rating</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.DriverID}>
              <td>
                <span className="driver-id">{driver.DriverID}</span>
              </td>
              <td>
                <strong>{driver.Ho_ten}</strong>
              </td>
              <td>{driver.CCCD}</td>
              <td>{formatRating(driver.Rating || 0)}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(driver.Trang_thai_hoat_dong)}`}>
                  {driver.Trang_thai_hoat_dong}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(driver)}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(driver)}
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

      {/* Empty State */}
      {drivers.length === 0 && (
        <div className="empty-state">
          <p>Chưa có tài xế nào</p>
        </div>
      )}
    </div>
  );
};

export default DriverTable;