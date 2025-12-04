import { useState, useEffect, useRef } from 'react';
import { ORDER_STATUSES, ORDER_SORT_FIELDS } from '../../utils/constants';
import './OrderFilter.css';
import { RefreshCw, Filter, User, Tag, BarChart2 } from 'react-feather';

const OrderFilter = ({ filters, onFilterChange, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value, immediate = false) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    
    // Nếu là dropdown (immediate = true), apply ngay
    if (immediate) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      onFilterChange(newFilters);
    } else {
      // Nếu là input text, debounce 500ms
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onFilterChange(newFilters);
      }, 1500);
    }
  };

  const handleReset = () => {
    const defaultFilters = {
      trang_thai_don: '',
      ma_khach_hang: '',
      sortKey: 'thoi_gian_dat_don',
      sortOrder: 'DESC'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
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
            value={localFilters.trang_thai_don}
            onChange={(e) => handleChange('trang_thai_don', e.target.value, true)}
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
            value={localFilters.ma_khach_hang}
            onChange={(e) => handleChange('ma_khach_hang', e.target.value, false)}
            disabled={loading}
          />
        </div>

        {/* Sort Field */}
        <div className="filter-group">
          <label>
              <BarChart2 size={14} color="#3B5998" /> Sắp xếp theo:
          </label>
          <select
            value={localFilters.sortKey}
            onChange={(e) => handleChange('sortKey', e.target.value, true)}
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
            value={localFilters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value, true)}
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