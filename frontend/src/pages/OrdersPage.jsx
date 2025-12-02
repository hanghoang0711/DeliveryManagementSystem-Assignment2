import { useState, useEffect } from 'react';
import { orderAPI } from '../api/services';
// Import Components (GIỮ NGUYÊN TÊN FILE CŨ CỦA BẠN)
import OrderTable from '../components/order/OrderTable.jsx';
import OrderForm from '../components/order/OderForm.jsx'; // <-- Đã sửa thành OderForm
import OrderFilter from '../components/order/OderFilter.jsx'; // <-- Đã sửa thành OderFilter
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Sidebar from '../components/layout/Sidebar'; // Import Sidebar
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';   

import './OrdersPage.css';

// Import Feather Icons
import { Package, Plus, LogOut, Search, FileText, X, Inbox } from 'react-feather';

const OrdersPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const [filters, setFilters] = useState({
        trang_thai_don: '',
        ma_khach_hang: '',
        sortKey: 'thoi_gian_dat_don',
        sortOrder: 'DESC'
    });

    const [showForm, setShowForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [deletingOrder, setDeletingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);

    const handleLogout = async () => { 
        await logout(); 
        navigate('/login'); 
    };

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const params = { page, limit: pagination.limit, ...filters };
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

    useEffect(() => { fetchOrders(1); }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handlePageChange = (page) => { fetchOrders(page); };
    const handleCreate = () => { setEditingOrder(null); setShowForm(true); };
    const handleEdit = (order) => { setEditingOrder(order); setShowForm(true); };
    const handleDeleteClick = (order) => { setDeletingOrder(order); };

    const handleView = async (order) => {
        try {
            const fullOrder = await orderAPI.getById(order.Ma_don_hang);
            setViewingOrder(fullOrder);
        } catch (err) {
            console.error('Error fetching order details:', err);
            alert('❌ Không thể tải thông tin đơn hàng');
        }
    };

    const handleFormSubmit = async (orderData) => {
        try {
            if (editingOrder) {
                await orderAPI.update(editingOrder.Ma_don_hang, orderData);
                alert('✅ Cập nhật đơn hàng thành công!');
            } else {
                await orderAPI.create(orderData);
                alert('✅ Tạo đơn hàng mới thành công!');
            }
            await fetchOrders(pagination.currentPage);
            setShowForm(false);
            setEditingOrder(null);
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể lưu thông tin'));
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await orderAPI.delete(deletingOrder.Ma_don_hang);
            alert('✅ Xóa đơn hàng thành công!');
            await fetchOrders(pagination.currentPage);
            setDeletingOrder(null);
        } catch (err) {
            console.error('Error deleting order:', err);
            alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa đơn hàng'));
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <Sidebar />

            <div className="dashboard-main-content">
                <div className="orders-page">
                    
                    {/* HEADER: Icon Package, Nút Navy */}
                    <div className="page-header">
                        <div>
                            <h1>
                                <Package size={28} color="#3B5998" />
                                Quản Lý Đơn Hàng
                            </h1>
                            <p>
                                Tổng {pagination.total} đơn hàng 
                                {filters.trang_thai_don && ` - Lọc: ${filters.trang_thai_don}`}
                            </p>
                        </div>
                        
                        <div className="header-actions">
                            <button 
                                className="btn-primary" 
                                onClick={handleCreate}
                                style={{ backgroundColor: '#3B5998' }}
                            >
                                <Plus size={18} /> Tạo đơn mới
                            </button>

                            <button className="btn-secondary" onClick={handleLogout}>
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
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
                            {orders.length > 0 ? (
                                <div className="table-wrapper">
                                    <OrderTable
                                        orders={orders}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteClick}
                                    />
                                    <div style={{ marginTop: '20px', padding: '0 20px 20px' }}>
                                        <Pagination
                                            currentPage={pagination.currentPage}
                                            totalPages={pagination.totalPages}
                                            total={pagination.total}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="no-results">
                                    <Inbox size={64} color="#cbd5e1" strokeWidth={1} />
                                    <p>Không tìm thấy đơn hàng nào</p>
                                    <button 
                                        className="btn-primary" 
                                        onClick={handleCreate}
                                        style={{ backgroundColor: '#3B5998' }}
                                    >
                                        <Plus size={18} /> Tạo đơn đầu tiên
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Modals */}
                    {showForm && (
                        <OrderForm
                            order={editingOrder}
                            onSubmit={handleFormSubmit}
                            onClose={() => { setShowForm(false); setEditingOrder(null); }}
                        />
                    )}

                    {viewingOrder && (
                        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
                            <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>
                                        <FileText size={24} color="#3B5998" />
                                        Chi tiết: {viewingOrder.Ma_don_hang}
                                    </h2>
                                    <button className="btn-close" onClick={() => setViewingOrder(null)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <pre>{JSON.stringify(viewingOrder, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {deletingOrder && (
                        <ConfirmDialog
                            title="Xác nhận xóa"
                            message={`Bạn có chắc muốn xóa đơn hàng "${deletingOrder.Ma_don_hang}"?`}
                            onConfirm={handleDeleteConfirm}
                            onCancel={() => setDeletingOrder(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;