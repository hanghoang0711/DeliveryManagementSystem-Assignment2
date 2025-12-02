import { useState, useEffect } from 'react';
import { TRIP_STATUSES, TRIP_SORT_FIELDS } from '../../utils/tripConstants';
import './TripFilter.css';

// Import Feather Icons
import { Search, RefreshCw } from 'react-feather';

const TripFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      status: '',
      ma_tai_xe: '',
      sortBy: 'DeliveryID',
      sortOrder: 'DESC'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="trip-filter-container">
      <div className="filter-grid">
        
        {/* Status Filter */}
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tất cả</option>
            {TRIP_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Filter */}
        <div className="filter-group">
          <label>Mã tài xế:</label>
          <input
            type="text"
            value={localFilters.ma_tai_xe}
            onChange={(e) => handleChange('ma_tai_xe', e.target.value)}
            placeholder="Ví dụ: DRV001"
          />
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label>Sắp xếp theo:</label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            {TRIP_SORT_FIELDS.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label>Thứ tự:</label>
          <select
            value={localFilters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          >
            <option value="ASC">Tăng dần ↑</option>
            <option value="DESC">Giảm dần ↓</option>
          </select>
        </div>

        {/* Actions (Nằm cùng hàng) */}
        <div className="filter-actions">
          <button className="btn-apply" onClick={handleApply}>
            <Search size={16} /> 
            Áp dụng
          </button>
          <button className="btn-reset" onClick={handleReset}>
            <RefreshCw size={16} /> 
            Reset
          </button>
        </div>

      </div>
    </div>
  );
};

export default TripFilter;