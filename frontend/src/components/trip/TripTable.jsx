import { TRIP_STATUS_WORKFLOW, formatDateTime, calculateDuration } from '../../utils/tripConstants';
import { formatDistance } from '../../utils/constants';
import './TripTable.css';

// Import Feather Icons thay cho emoji
import { Eye, Plus, Trash2, Calendar, MapPin, Clock, CheckCircle, XCircle, ChevronDown } from 'react-feather';

const TripTable = ({ trips, onViewDetails, onAddOrder, onUpdateStatus, onDelete }) => {
  
  /**
   * Get available next statuses for a trip
   */
  const getNextStatuses = (currentStatus) => {
    return TRIP_STATUS_WORKFLOW[currentStatus] || [];
  };

  // Helper render badge màu pastel
  const renderStatusBadge = (status) => {
      let style = {};
      let Icon = Clock;

      if (status === 'Hoàn thành') {
          style = { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' };
          Icon = CheckCircle;
      } else if (status === 'Đã hủy') {
          style = { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' };
          Icon = XCircle;
      } else {
          // Đang thực hiện
          style = { backgroundColor: '#e0f2fe', color: '#075985', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' };
      }
      
      return (
          <span style={style}>
              <Icon size={12} /> {status}
          </span>
      );
  };

  return (
    <div className="trip-table-container">
      <table className="trip-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tài xế</th>
            <th>Trạng thái</th>
            {/* Giữ nguyên việc ẩn các cột ngày tháng như bạn muốn */}
            <th>Tổng quãng đường</th>
            <th>Số đơn hàng gộp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => {
            const nextStatuses = getNextStatuses(trip.TrangThaiChuyen);

            // Logic tính tổng quãng đường của bạn
            const totalDistance = trip.donHangs && trip.donHangs.length > 0
                ? trip.donHangs.reduce((sum, dh) => sum + (parseFloat(dh.quang_duong) || 0), 0)
                : 0;

            return (
              <tr key={trip.DeliveryID}>
                {/* Mã chuyến */}
                <td className="trip-id" style={{fontWeight: '700', color: '#3B5998'}}>{trip.DeliveryID}</td>

                {/* Tài xế */}
                <td style={{fontWeight: '500'}}>{trip.taiXe?.Ho_ten || trip.DriverID}</td>

                {/* Trạng thái */}
                <td>{renderStatusBadge(trip.TrangThaiChuyen)}</td>

                {/* Tổng quãng đường */}
                <td>
                    <div style={{display:'flex', alignItems:'center', gap:'6px', color:'#64748b'}}>
                        <MapPin size={14} />
                        {formatDistance(totalDistance)}
                    </div>
                </td>

                {/* Số đơn hàng */}
                <td>
                  <span className="order-count-badge" style={{fontWeight:'600', background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px'}}>
                    {trip.donHangs?.length || trip.so_luong_don_gop || 0} đơn
                  </span>
                </td>

                {/* Hành động */}
                <td>
                  <div className="action-buttons" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      {/* Nút Xem */}
                      <button 
                        className="btn-icon" 
                        onClick={() => onViewDetails(trip)} 
                        title="Xem chi tiết"
                        style={{border: '1px solid #e2e8f0', background:'white', borderRadius:'6px', padding:'6px', cursor:'pointer'}}
                      > 
                        <Eye size={16} color="#64748b"/> 
                      </button>

                      {/* Nút Thêm đơn */}
                      {trip.TrangThaiChuyen === 'Đang thực hiện' && (
                        <button 
                            className="btn-icon" 
                            onClick={() => onAddOrder(trip)} 
                            title="Thêm đơn hàng"
                            style={{border: '1px solid #e2e8f0', background:'white', borderRadius:'6px', padding:'6px', cursor:'pointer'}}
                        > 
                            <Plus size={16} color="#3B5998"/> 
                        </button>
                      )}

                      {/* Select cập nhật trạng thái */}
                      {nextStatuses.length > 0 && (
                        <select 
                            className="status-select-mini"
                            onChange={(e) => onUpdateStatus(trip, e.target.value)} 
                            defaultValue=""
                            style={{padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', cursor:'pointer'}}
                        >
                          <option value="" disabled>Cập nhật...</option>
                          {nextStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {/* Nút Xóa (nếu cần) */}
                      <button className="btn-icon delete" onClick={() => onDelete(trip)} style={{border: '1px solid #e2e8f0', background:'white', borderRadius:'6px', padding:'6px', cursor:'pointer'}}>
                          <Trash2 size={16} color="#ef4444"/>
                      </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TripTable;