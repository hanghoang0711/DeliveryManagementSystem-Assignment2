import { formatCurrency } from '../../utils/constants';
import './TopCustomersCard.css';

// Import Feather Icons
import { User, ShoppingBag, Award, Info, Users } from 'react-feather';

const TopCustomersCard = ({ customers, limit, onLimitChange }) => {
  
  // Get medal icon or number
  const renderRank = (rank) => {
    if (rank === 1) return <Award size={24} color="#fbbf24" fill="#fbbf24" />; // Vàng
    if (rank === 2) return <Award size={24} color="#94a3b8" fill="#94a3b8" />; // Bạc
    if (rank === 3) return <Award size={24} color="#b45309" fill="#b45309" />; // Đồng
    return <span style={{fontSize: '14px', color: '#64748b'}}>#{rank}</span>;
  };

  const getAverageOrderValue = (customer) => {
    if (customer.so_don_hang === 0) return 0;
    return customer.total_revenue / customer.so_don_hang;
  };

  return (
    <div className="report-card top-customers-card">
      {/* Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>
             <Users size={20} /> 
             Top Khách hàng theo Doanh thu
          </h2>
          <p>Khách hàng có giá trị cao nhất</p>
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
        {customers.length > 0 ? (
          <div className="customers-list">
            {customers.slice(0, limit).map((customer, index) => (
              <div key={customer.Ma_khach_hang} className={`customer-item rank-${index + 1}`}>
                
                {/* Rank */}
                <div className="customer-rank">
                  {renderRank(index + 1)}
                </div>

                {/* Info */}
                <div className="customer-info">
                  <div className="customer-name">
                    <User size={14} color="#3B5998" />
                    <strong>{customer.Email || 'Khách hàng'}</strong>
                    <span className="customer-id">({customer.Ma_khach_hang})</span>
                  </div>
                  
                  <div className="customer-stats">
                    <span>
                      <ShoppingBag size={12} /> {customer.so_don_hang} đơn
                    </span>
                    <span className="avg-order">
                      TB: {formatCurrency(getAverageOrderValue(customer))}
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="customer-revenue">
                  <span className="revenue-label">Tổng doanh thu</span>
                  <div className="revenue-value">
                    {formatCurrency(customer.total_revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <Users size={48} color="#cbd5e1" strokeWidth={1} />
            <p>Chưa có dữ liệu khách hàng</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <Info size={14} />
        <span>Doanh thu tính từ tổng giá trị đơn hàng sau giảm giá</span>
      </div>
    </div>
  );
};

export default TopCustomersCard;