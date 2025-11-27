import { useState, useEffect } from 'react';
import { orderAPI } from '../api/services';
import OrderTable from '../components/order/OrderTable.jsx'
import OrderForm from '../components/order/OderForm.jsx';
import OrderFilter from '../components/order/OderFilter.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Pagination from '../components/common/Pagination.jsx';
import './OrdersPage.css';

const OrdersPage = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter state
  const [filters, setFilters] = useState({
    trang_thai_don: '',
    ma_khach_hang: '',
    sortKey: 'thoi_gian_dat_don',
    sortOrder: 'DESC'
  });

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  /**
   * Fetch orders từ API
   */
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      const data = await orderAPI.getAll(params);
      
      setOrders(data.data || []);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total,
        limit: data.pagination.limit
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Load orders khi component mount hoặc filters thay đổi
  useEffect(() => {
    fetchOrders(1);
  }, [filters]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  /**
   * Handle create new order
   */
  const handleCreate = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  /**
   * Handle view order details
   */
  const handleView = async (order) => {
    try {
      // Fetch full order details
      const fullOrder = await orderAPI.getById(order.Ma_don_hang);
      setViewingOrder(fullOrder);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('❌ Không thể tải thông tin đơn hàng');
    }
  };

  /**
   * Handle edit order (update status)
   */
  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (orderData) => {
    try {
      if (editingOrder) {
        // Update existing order (chủ yếu là status)
        await orderAPI.update(editingOrder.Ma_don_hang, orderData);
        alert('✅ Cập nhật đơn hàng thành công!');
      } else {
        // Create new order
        await orderAPI.create(orderData);
        alert('✅ Tạo đơn hàng mới thành công!');
      }
      
      // Refresh list
      await fetchOrders(pagination.currentPage);
      
      // Close form
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể lưu thông tin'));
      throw err;
    }
  };

  /**
   * Handle delete order
   */
  const handleDeleteClick = (order) => {
    setDeletingOrder(order);
  };

  const handleDeleteConfirm = async () => {
    try {
      await orderAPI.delete(deletingOrder.Ma_don_hang);
      alert('✅ Xóa đơn hàng thành công!');
      
      // Refresh list
      await fetchOrders(pagination.currentPage);
      
      // Close dialog
      setDeletingOrder(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa đơn hàng'));
    }
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>📦 Quản Lý Đơn Hàng</h1>
          <p>
            Tổng {pagination.total} đơn hàng 
            {filters.trang_thai_don && ` - Lọc: ${filters.trang_thai_don}`}
          </p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          ➕ Tạo đơn hàng mới
        </button>
      </div>

      {/* Filter Section */}
      <OrderFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => fetchOrders(pagination.currentPage)}>Thử lại</button>
        </div>
      )}

      {/* Order Table */}
      {!loading && !error && (
        <>
          <OrderTable
            orders={orders}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* No Results */}
      {!loading && !error && orders.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy đơn hàng nào</p>
        </div>
      )}

      {/* Order Form Modal */}
      {showForm && (
        <OrderForm
          order={editingOrder}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Chi tiết đơn hàng</h2>
              <button className="btn-close" onClick={() => setViewingOrder(null)}>✖️</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(viewingOrder, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingOrder && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa đơn hàng "${deletingOrder.Ma_don_hang}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;