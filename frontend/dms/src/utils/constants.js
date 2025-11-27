/**
 * ORDER STATUSES
 * 11 trạng thái đơn hàng theo workflow
 */
export const ORDER_STATUSES = [
  'Đang xử lý',
  'Đang tìm tài xế',
  'Đã tìm được tài xế',
  'Đang lấy hàng',
  'Lấy hàng thành công',
  'Lấy hàng thất bại',
  'Đang giao hàng',
  'Giao hàng thành công',
  'Giao hàng thất bại',
  'Đã hoàn về kho',
  'Đã hoàn thành'
];

/**
 * Status Badge Colors
 */
export const STATUS_COLORS = {
  'Đang xử lý': 'blue',
  'Đang tìm tài xế': 'orange',
  'Đã tìm được tài xế': 'cyan',
  'Đang lấy hàng': 'purple',
  'Lấy hàng thành công': 'green',
  'Lấy hàng thất bại': 'red',
  'Đang giao hàng': 'purple',
  'Giao hàng thành công': 'green',
  'Giao hàng thất bại': 'red',
  'Đã hoàn về kho': 'gray',
  'Đã hoàn thành': 'darkgreen'
};

/**
 * Status Workflow - Các trạng thái hợp lệ tiếp theo
 */
export const STATUS_WORKFLOW = {
  'Đang xử lý': ['Đang tìm tài xế'],
  'Đang tìm tài xế': ['Đã tìm được tài xế', 'Đang xử lý'],
  'Đã tìm được tài xế': ['Đang lấy hàng'],
  'Đang lấy hàng': ['Lấy hàng thành công', 'Lấy hàng thất bại'],
  'Lấy hàng thành công': ['Đang giao hàng'],
  'Lấy hàng thất bại': ['Đã hoàn về kho'],
  'Đang giao hàng': ['Giao hàng thành công', 'Giao hàng thất bại'],
  'Giao hàng thành công': ['Đã hoàn thành'],
  'Giao hàng thất bại': ['Đã hoàn về kho'],
  'Đã hoàn về kho': ['Đang xử lý'],
  'Đã hoàn thành': []
};

/**
 * Sort Fields
 */
export const ORDER_SORT_FIELDS = [
  { value: 'thoi_gian_dat_don', label: 'Thời gian đặt' },
  { value: 'Ma_don_hang', label: 'Mã đơn hàng' },
  { value: 'quang_duong', label: 'Quãng đường' },
  { value: 'phi_van_chuyen_sau_giam', label: 'Phí vận chuyển' },
  { value: 'gia_tri_hang_hoa_phi_van_chuyen', label: 'Giá trị hàng hóa' }
];

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
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
 * Format distance
 */
export const formatDistance = (km) => {
  if (km == null) return 'N/A';
  return `${parseFloat(km).toFixed(2)} km`;
};
