import './DriverTable.css';
import { Edit, Trash2, Eye, Star, CheckCircle, XCircle, AlertCircle, User } from 'react-feather';

const DriverTable = ({ drivers, onView, onEdit, onDelete }) => {
  
  /**
   * Format rating với sao
   */
  const formatRating = (rating) => {
    const num = parseFloat(rating) || 0;
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span style={{fontWeight: '600', color: '#334155'}}>{num.toFixed(1)}</span>
        </div>
    );
  };

  /**
   * Get badge class & icon theo trạng thái
   */
  const getStatusBadge = (status) => {
    let className = 'badge ';
    let Icon = AlertCircle;

    switch (status) {
      case 'Đang hoạt động':
        className += 'badge-success';
        Icon = CheckCircle;
        break;
      case 'Không hoạt động':
        className += 'badge-danger';
        Icon = XCircle;
        break;
      case 'Tạm nghỉ':
        className += 'badge-warning';
        Icon = Clock; // Import Clock nếu cần, hoặc dùng AlertCircle tạm
        break;
      default:
        className += 'badge-secondary';
    }
    
    return (
        <span className={className}>
            <Icon size={12} /> {status}
        </span>
    );
  };

  return (
    <div className="table-container">
      {drivers.length > 0 ? (
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
                    <div style={{fontWeight: '600', color: '#1e293b'}}>{driver.Ho_ten}</div>
                  </td>
                  <td style={{fontFamily: 'monospace', color: '#475569'}}>{driver.CCCD}</td>
                  <td>{formatRating(driver.Rating)}</td>
                  <td>
                    {getStatusBadge(driver.Trang_Thai)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action"
                        onClick={() => onView(driver)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-action"
                        onClick={() => onEdit(driver)}
                        title="Sửa thông tin"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => onDelete(driver)}
                        title="Xóa tài xế"
                      >
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
            <User size={48} color="#cbd5e1" strokeWidth={1} />
            <p>Chưa có tài xế nào trong hệ thống</p>
        </div>
      )}
    </div>
  );
};

export default DriverTable;