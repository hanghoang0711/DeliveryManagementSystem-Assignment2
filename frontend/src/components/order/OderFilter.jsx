import { ORDER_STATUSES, ORDER_SORT_FIELDS } from '../../utils/constants';
import './OrderFilter.css';
import { RefreshCw, Filter, User, Tag, BarChart2 } from 'react-feather';

const OrderFilter = ({ filters, onFilterChange, loading }) => {
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      trang_thai_don: '',
      ma_khach_hang: '',
      sortKey: 'thoi_gian_dat_don',
      sortOrder: 'DESC'
    });
  };

  return (
    <div className="order-filter">
      <div className="filter-row">
        
        {/* Status Filter */}
        <div className="filter-group">
          <label>
              <Tag size={14} color="#3B5998" /> Trạng thái:
          </label>
          <select
            value={filters.trang_thai_don}
            onChange={(e) => handleChange('trang_thai_don', e.target.value)}
            disabled={loading}
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Customer Filter */}
        <div className="filter-group">
          <label>
              <User size={14} color="#3B5998" /> Khách hàng:
          </label>
          <input
            type="text"
            placeholder="Mã khách hàng (KH001)"
            value={filters.ma_khach_hang}
            onChange={(e) => handleChange('ma_khach_hang', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sort Field */}
        <div className="filter-group">
          <label>
              <BarChart2 size={14} color="#3B5998" /> Sắp xếp theo:
          </label>
          <select
            value={filters.sortKey}
            onChange={(e) => handleChange('sortKey', e.target.value)}
            disabled={loading}
          >
            {ORDER_SORT_FIELDS.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label>
              <Filter size={14} color="#3B5998" /> Thứ tự:
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
            disabled={loading}
          >
            <option value="ASC">Tăng dần</option>
            <option value="DESC">Giảm dần</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="filter-actions">
          <button
            className="btn-reset"
            onClick={handleReset}
            disabled={loading}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderFilter;