import { formatCurrency } from '../../utils/constants';
import './TopCustomersCard.css';

const TopCustomersCard = ({ customers, limit, onLimitChange }) => {
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
   * Calculate average order value
   */
  const getAverageOrderValue = (customer) => {
    if (customer.totalOrders === 0) return 0;
    return customer.total_revenue / customer.so_don_hang;
  };

  return (
    <div className="report-card top-customers-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>💰 Top Khách hàng theo Doanh thu</h2>
          <p>Khách hàng có giá trị cao nhất</p>
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
        {customers.length > 0 ? (
          <div className="customers-list">
            {customers.slice(0, limit).map((customer, index) => (
              <div key={customer.Ma_khach_hang} className={`customer-item rank-${index + 1}`}>
                {/* Rank */}
                <div className="customer-rank">
                  <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                </div>

                {/* Customer Info */}
                <div className="customer-info">
                  <div className="customer-name">
                    <strong>{customer.Email}</strong>
                    <span className="customer-id">{customer.Ma_khach_hang}</span>
                  </div>
                  <div className="customer-stats">
                    <span className="orders-count">
                      📦 {customer.so_don_hang} đơn hàng
                    </span>
                    <span className="avg-order">
                      Trung bình: {formatCurrency(getAverageOrderValue(customer))}
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="customer-revenue">
                  <div className="revenue-label">Tổng doanh thu</div>
                  <div className="revenue-value">
                    {formatCurrency(customer.total_revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>📭 Không có dữ liệu khách hàng</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <p>💡 <em>Doanh thu tính từ tổng giá trị đơn hàng sau giảm giá</em></p>
      </div>
    </div>
  );
};

export default TopCustomersCard;