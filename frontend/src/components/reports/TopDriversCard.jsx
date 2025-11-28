import { formatCurrency } from '../../utils/constants';
import './TopDriversCard.css';

const TopDriversCard = ({ drivers, limit, onLimitChange }) => {
  /**
   * Get medal emoji for rank
   */
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  /**
   * Get rating stars
   */
  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars;
  };

  return (
    <div className="report-card top-drivers-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>🏆 Top Tài xế theo Rating</h2>
          <p>Tài xế xuất sắc nhất hệ thống</p>
        </div>
        
        {/* Limit Selector */}
        <div className="limit-selector">
          <label>Hiển thị:</label>
          <select value={limit} onChange={(e) => onLimitChange(parseInt(e.target.value))}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {drivers.length > 0 ? (
          <div className="drivers-list">
            {drivers.slice(0, limit).map((driver, index) => (
              <div key={driver.Ma_tai_xe} className={`driver-item rank-${index + 1}`}>
                {/* Rank */}
                <div className="driver-rank">
                  <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                </div>

                {/* Driver Info */}
                <div className="driver-info">
                  <div className="driver-name">
                    <strong>{driver.Ten_tai_xe}</strong>
                    <span className="driver-id">{driver.Ma_tai_xe}</span>
                  </div>
                  <div className="driver-stats">
                    <span className="rating">
                      {getRatingStars(driver.diem_trung_binh)} 
                      <strong>{driver.diem_trung_binh.toFixed(1)}</strong>
                    </span>
                    <span className="trips-count">
                      🚚 {driver.so_don_giao} đơn
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>📭 Không có dữ liệu tài xế</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <p>💡 <em>Rating trung bình từ khách hàng đánh giá</em></p>
      </div>
    </div>
  );
};

export default TopDriversCard;