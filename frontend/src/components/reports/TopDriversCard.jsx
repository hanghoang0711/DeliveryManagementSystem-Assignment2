import './TopDriversCard.css';

// Import Feather Icons
import { User, Star, Award, Info, Truck, Users } from 'react-feather';

const TopDriversCard = ({ drivers, limit, onLimitChange }) => {
  
  // Get medal icon or number
  const renderRank = (rank) => {
    if (rank === 1) return <Award size={24} color="#fbbf24" fill="#fbbf24" />; // Vàng
    if (rank === 2) return <Award size={24} color="#94a3b8" fill="#94a3b8" />; // Bạc
    if (rank === 3) return <Award size={24} color="#b45309" fill="#b45309" />; // Đồng
    return <span style={{fontSize: '14px', color:'#64748b'}}>#{rank}</span>;
  };

  // Get stars
  const renderStars = (rating) => {
      return (
          <div style={{display:'flex', alignItems:'center', gap:'2px'}}>
              <Star size={12} fill="#eab308" color="#eab308"/>
              <span>{parseFloat(rating).toFixed(1)}</span>
          </div>
      );
  };

  return (
    <div className="report-card top-drivers-card">
      {/* Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>
             <Award size={20} /> 
             Top Tài xế theo Rating
          </h2>
          <p>Tài xế xuất sắc nhất hệ thống</p>
        </div>
        
        <div className="limit-selector">
          <label>Hiển thị:</label>
          <select value={limit} onChange={(e) => onLimitChange(parseInt(e.target.value))}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {drivers.length > 0 ? (
          <div className="drivers-list">
            {drivers.slice(0, limit).map((driver, index) => (
              <div key={driver.Ma_tai_xe} className={`driver-item rank-${index + 1}`}>
                
                {/* Rank */}
                <div className="driver-rank">
                  {renderRank(index + 1)}
                </div>

                {/* Info */}
                <div className="driver-info">
                  <div className="driver-name">
                    <User size={14} color="#3B5998" />
                    <strong>{driver.Ten_tai_xe}</strong>
                    <span className="driver-id">({driver.Ma_tai_xe})</span>
                  </div>
                  
                  <div className="driver-stats">
                    <span className="rating">
                      {renderStars(driver.diem_trung_binh)} 
                    </span>
                    <span className="trips-count">
                      <Truck size={12} /> {driver.so_don_giao} đơn
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <Users size={48} color="#cbd5e1" strokeWidth={1} style={{marginBottom:'10px'}}/>
            <p>Không có dữ liệu tài xế</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <Info size={14} />
        <span>Rating trung bình từ khách hàng đánh giá</span>
      </div>
    </div>
  );
};

export default TopDriversCard;