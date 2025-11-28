import { TRIP_STATUS_COLORS, TRIP_STATUS_WORKFLOW, formatDateTime, calculateDuration } from '../../utils/tripConstants';
import { formatCurrency, formatDistance } from '../../utils/constants';
import './TripTable.css';

const TripTable = ({ trips, onViewDetails, onAddOrder, onUpdateStatus, onDelete }) => {
  /**
   * Get available next statuses for a trip
   */
  const getNextStatuses = (currentStatus) => {
    return TRIP_STATUS_WORKFLOW[currentStatus] || [];
  };

  return (
    <div className="trip-table-container">
      <table className="trip-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tài xế</th>
            <th>Trạng thái</th>
            {/* <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th> */}
            {/* <th>Thời gian (giờ)</th> */}
            <th>Tổng quãng đường</th>
            <th>Số đơn hàng gộp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => {
            const duration =
              trip.Ngay_bat_dau && trip.Ngay_ket_thuc
                ? calculateDuration(trip.Ngay_bat_dau, trip.Ngay_ket_thuc)
                : null;
            const nextStatuses = getNextStatuses(trip.TrangThaiChuyen);

            return (
              <tr key={trip.DeliveryID}>
                <td className="trip-id">{trip.DeliveryID}</td>

                <td>{trip.taiXe?.Ho_ten || trip.DriverID}</td>

                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: TRIP_STATUS_COLORS[trip.TrangThaiChuyen] }}
                  >
                    {trip.TrangThaiChuyen}
                  </span>
                </td>

                {/* <td>{trip.Ngay_bat_dau ? formatDateTime(trip.Ngay_bat_dau) : 'N/A'}</td>
                <td>{trip.Ngay_ket_thuc ? formatDateTime(trip.Ngay_ket_thuc) : '—'}</td> */}

                {/* <td>{duration !== null ? `${duration}h` : '—'}</td> */}

                {/* <td>{formatDistance(trip.tong_quang_duong || 0)}</td>

                <td className="order-count">
                  <strong>{trip.so_don_hang || 0}</strong> đơn
                </td> */}
                <td>
                  {trip.donHangs && trip.donHangs.length > 0
                    ? `${trip.donHangs.reduce((sum, dh) => sum + (parseFloat(dh.quang_duong) || 0), 0).toFixed(2)} km`
                    : '0 km'}
                </td>

                <td className="order-count">
                  <strong>{trip.donHangs?.length || trip.so_luong_don_gop || 0}</strong> đơn
                </td>

                <td>
                  <button onClick={() => onViewDetails(trip)}> 👁️ </button>

                  {trip.TrangThaiChuyen === 'Đang thực hiện' && (
                    <button onClick={() => onAddOrder(trip)}> ➕ </button>
                  )}

                  {nextStatuses.length > 0 && (
                    <select onChange={(e) => onUpdateStatus(trip, e.target.value)} defaultValue="">
                      <option value="" disabled>
                        Cập nhật trạng thái
                      </option>
                      {nextStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}

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