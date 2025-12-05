/**
 * Delivery Trip Statuses
 */
export const TRIP_STATUSES = [
  { value: 'Đang thực hiện', label: 'Đang thực hiện', icon: '🚚' },
  { value: 'Hoàn thành', label: 'Hoàn thành', icon: '✅' },
  { value: 'Đã hủy', label: 'Đã hủy', icon: '❌' }
];

/**
 * Trip Status Colors for badges
 */
export const TRIP_STATUS_COLORS = {
  'Đang thực hiện': '#3498db',  // Blue
  'Hoàn thành': '#27ae60',      // Green
  'Đã hủy': '#95a5a6'           // Gray
};

/**
 * Trip Status Workflow (Valid transitions)
 */
export const TRIP_STATUS_WORKFLOW = {
  'Đang thực hiện': ['Hoàn thành', 'Đã hủy'],
  'Hoàn thành': [],  // Can't change from completed
  'Đã hủy': []       // Can't change from cancelled
};

/**
 * Sort fields for delivery trips
 * Chỉ dùng field tồn tại trong model CHUYEN_GIAO_HANG
 */
export const TRIP_SORT_FIELDS = [
  { value: 'DeliveryID', label: 'Mã chuyến' },
  { value: 'so_luong_don_gop', label: 'Số đơn gộp' },
  { value: 'TrangThaiChuyen', label: 'Trạng thái' },
  { value: 'DriverID', label: 'Mã tài xế' }
];

/**
 * Format datetime for display
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate trip duration in hours
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return diffHours;
};