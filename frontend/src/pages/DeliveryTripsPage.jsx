import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import deliveryTripAPI from '../services/deliveryTripAPI';
import TripFilter from '../components/trip/TripFilter';
import TripTable from '../components/trip/TripTable';
import TripForm from '../components/trip/TripForm';
import TripDetailsModal from '../components/trip/TripDetailsModal';
import AddOrderToTripForm from '../components/trip/AddOrderToTripForm';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Sidebar from '../components/layout/SideBar';
import './DeliveryTripsPage.css';

// Import Feather Icons
import { Truck, Plus, LogOut, FileText, X, Inbox } from 'react-feather';

const DeliveryTripsPage = () => {
    // ... (Giữ nguyên logic state & effect) ...
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ status: '', ma_tai_xe: '', sortBy: 'DeliveryID', sortOrder: 'DESC' });
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAddOrderModal, setShowAddOrderModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                trang_thai: filters.status || '',
                driver_id: filters.ma_tai_xe || '',
                sortKey: filters.sortBy === 'ngay_bat_dau' ? 'DeliveryID' : filters.sortBy || 'DeliveryID',
                sortOrder: filters.sortOrder || 'DESC'
            };
            const data = await deliveryTripAPI.getAll(params);
            setTrips(Array.isArray(data.data) ? data.data : []);
            setPagination(prev => ({ ...prev, total: data.pagination.total, totalPages: data.pagination.totalPages }));
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách chuyến giao hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        setPagination(prev => ({ ...prev, page }));
    }, [searchParams]);

    useEffect(() => { fetchTrips(); }, [pagination.page, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
        setSearchParams({ page: '1' });
    };
    const handlePageChange = (page) => { setPagination(prev => ({ ...prev, page })); setSearchParams({ page: page.toString() }); };
    const handleCreateTrip = async (tripData) => { try { await deliveryTripAPI.create(tripData); alert('✅ Tạo chuyến giao hàng thành công!'); setShowCreateModal(false); fetchTrips(); } catch (err) { alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể tạo chuyến')); } };
    const handleViewDetails = async (trip) => { 
        try { 
            const response = await deliveryTripAPI.getById(trip.DeliveryID); 
            const fullTrip = response.data || response;
            setSelectedTrip(fullTrip); 
            setShowDetailsModal(true); 
        } catch (err) { 
            alert('❌ Không thể tải chi tiết: ' + (err.response?.data?.message || err.message)); 
        } 
    };
    const handleAddOrder = (trip) => { setSelectedTrip(trip); setShowAddOrderModal(true); };
    const handleAddOrderSubmit = async (orderData) => { try { await deliveryTripAPI.addOrder(selectedTrip.DeliveryID, orderData); alert('✅ Thêm đơn hàng thành công!'); setShowAddOrderModal(false); fetchTrips(); } catch (err) { alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể thêm đơn hàng')); } };
    const handleUpdateStatus = async (trip, newStatus) => { try { const updateData = { TrangThaiChuyen: newStatus, ngay_ket_thuc: newStatus === 'Hoàn thành' ? new Date().toISOString() : undefined }; await deliveryTripAPI.update(trip.DeliveryID, updateData); alert('✅ Cập nhật thành công!'); fetchTrips(); } catch (err) { alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể cập nhật')); } };
    const handleDeleteClick = (trip) => { setTripToDelete(trip); setShowDeleteDialog(true); };
    const handleDeleteConfirm = async () => { try { await deliveryTripAPI.delete(tripToDelete.DeliveryID); alert('✅ Xóa thành công!'); setShowDeleteDialog(false); setTripToDelete(null); fetchTrips(); } catch (err) { alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa')); } };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main-content">
                <div className="chuyen-giao-hang-page">
                    
                    {/* HEADER */}
                    <div className="page-header">
                        <div>
                            <h1 style={{ fontFamily: 'Inter, sans-serif' }}>
                                <Truck size={28} />
                                Quản lý Chuyến giao hàng
                            </h1>
                            <p>Theo dõi tiến trình vận chuyển của <strong>{user?.username}</strong></p>
                        </div>
                        
                        <div className="header-actions">
                            {/* Nút Tạo chuyến: Sửa className thành btn-primary để nhận CSS màu Navy */}
                            <button 
                                className="banner-action-button" 
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus size={18} /> Tạo chuyến mới
                            </button>

                            <button className="btn-secondary" onClick={handleLogout}>
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
                    </div>

                    {/* FILTER */}
                    <TripFilter filters={filters} onFilterChange={handleFilterChange} />

                    {/* LOADING & ERROR */}
                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Đang tải...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <p>❌ {error}</p>
                            <button onClick={fetchTrips}>Thử lại</button>
                        </div>
                    )}

                    {/* TABLE & NO RESULTS */}
                    {!loading && !error && (
                        <>
                            {trips.length > 0 ? (
                                <>
                                    <TripTable
                                        trips={trips}
                                        onViewDetails={handleViewDetails}
                                        onAddOrder={handleAddOrder}
                                        onUpdateStatus={handleUpdateStatus}
                                        onDelete={handleDeleteClick}
                                    />

                                    <div style={{marginTop: '20px'}}>
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.totalPages}
                                            total={pagination.total}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="no-results">
                                    <Inbox size={64} color="#cbd5e1" strokeWidth={1} style={{marginBottom: '16px'}} />
                                    <p>Không tìm thấy chuyến giao hàng nào</p>
                                    
                                    {/* Nút Tạo đầu tiên: Sửa className thành btn-primary */}
                                    <button 
                                        className="banner-action-button" 
                                        onClick={() => setShowCreateModal(true)}
                                        style={{ margin: '0 auto' }}
                                    >
                                        <Plus size={18} /> Tạo chuyến đầu tiên
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* CREATE MODAL */}
                    {showCreateModal && (
                        <TripForm
                            onSubmit={handleCreateTrip}
                            onCancel={() => setShowCreateModal(false)}
                        />
                    )}

                    {/* ADD ORDER MODAL */}
                    {showAddOrderModal && (
                        <AddOrderToTripForm
                            trip={selectedTrip}
                            onSubmit={handleAddOrderSubmit}
                            onCancel={() => setShowAddOrderModal(false)}
                        />
                    )}

                    {/* DETAILS MODAL */}
                    {showDetailsModal && selectedTrip && (
                        <TripDetailsModal
                            trip={selectedTrip}
                            onClose={() => { setShowDetailsModal(false); setSelectedTrip(null); }}
                        />
                    )}

                    {/* DELETE CONFIRM */}
                    {showDeleteDialog && tripToDelete && (
                        <ConfirmDialog
                            title="Xác nhận xóa"
                            message={`Bạn có chắc muốn xóa chuyến giao hàng "${tripToDelete.DeliveryID}"?`}
                            onConfirm={handleDeleteConfirm}
                            onCancel={() => { setShowDeleteDialog(false); setTripToDelete(null); }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryTripsPage;