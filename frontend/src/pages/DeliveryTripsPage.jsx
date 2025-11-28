import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import deliveryTripAPI from '../services/deliveryTripAPI';
import TripFilter from '../components/trip/TripFilter';
import TripTable from '../components/trip/TripTable';
import TripForm from '../components/trip/TripForm';
import AddOrderToTripForm from '../components/trip/AddOrderToTripForm';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './DeliveryTripsPage.css';

const DeliveryTripsPage = () => {
  // State
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    ma_tai_xe: '',
    sortBy: 'DeliveryID',
    sortOrder: 'DESC'
  });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // URL params
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetch delivery trips
   */
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
      console.log("🎯 Dữ liệu API trả về:", data);


      setTrips(Array.isArray(data.data) ? data.data : []);

      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách chuyến giao hàng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount và khi params thay đổi
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  useEffect(() => {
    fetchTrips();
  }, [pagination.page, filters]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({ page: '1' });
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    setSearchParams({ page: page.toString() });
  };

  /**
   * Handle create trip
   */
  const handleCreateTrip = async (tripData) => {
    try {
      await deliveryTripAPI.create(tripData);
      alert('✅ Tạo chuyến giao hàng thành công!');
      setShowCreateModal(false);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể tạo chuyến'));
    }
  };

  /**
   * Handle view trip details
   */
  const handleViewDetails = async (trip) => {
    try {
      const data = await deliveryTripAPI.getById(trip.Ma_chuyen_giao_hang);
      setSelectedTrip(data.trip);
      setShowDetailsModal(true);
    } catch (err) {
      alert('❌ Không thể tải chi tiết chuyến: ' + err.response?.data?.message);
    }
  };

  /**
   * Handle add order to trip
   */
  const handleAddOrder = (trip) => {
    setSelectedTrip(trip);
    setShowAddOrderModal(true);
  };

  /**
   * Handle add order submit
   */
  const handleAddOrderSubmit = async (orderData) => {
    try {
      await deliveryTripAPI.addOrder(selectedTrip.Ma_chuyen_giao_hang, orderData);
      alert('✅ Thêm đơn hàng vào chuyến thành công!');
      setShowAddOrderModal(false);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể thêm đơn hàng'));
    }
  };

  /**
   * Handle update trip status
   */
  const handleUpdateStatus = async (trip, newStatus) => {
    try {
      const updateData = {
        trang_thai: newStatus
      };

      // If completing the trip, add end date
      if (newStatus === 'Hoàn thành') {
        updateData.ngay_ket_thuc = new Date().toISOString();
      }

      await deliveryTripAPI.update(trip.Ma_chuyen_giao_hang, updateData);
      alert('✅ Cập nhật trạng thái thành công!');
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể cập nhật'));
    }
  };

  /**
   * Handle delete trip
   */
  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deliveryTripAPI.delete(tripToDelete.Ma_chuyen_giao_hang);
      alert('✅ Xóa chuyến giao hàng thành công!');
      setShowDeleteDialog(false);
      setTripToDelete(null);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa chuyến'));
    }
  };

  return (
    <div className="chuyen-giao-hang-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>🚚 Quản lý Chuyến giao hàng</h1>
          <p>Tạo chuyến, thêm đơn hàng, theo dõi tiến trình giao hàng</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          ➕ Tạo chuyến mới
        </button>
      </div>

      {/* Filter */}
      <TripFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={fetchTrips}>Thử lại</button>
        </div>
      )}

      {/* Trips Table */}
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

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="no-results">
              <p>📭 Không tìm thấy chuyến giao hàng nào</p>
              <button onClick={() => setShowCreateModal(true)}>
                Tạo chuyến đầu tiên
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Trip Modal */}
      {showCreateModal && (
        <TripForm
          onSubmit={handleCreateTrip}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Trip Details Modal */}
      {showDetailsModal && selectedTrip && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content trip-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Chi tiết chuyến: {selectedTrip.Ma_chuyen_giao_hang}</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(selectedTrip, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Add Order to Trip Modal */}
      {showAddOrderModal && selectedTrip && (
        <AddOrderToTripForm
          trip={selectedTrip}
          onSubmit={handleAddOrderSubmit}
          onClose={() => setShowAddOrderModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && tripToDelete && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa chuyến "${tripToDelete.Ma_chuyen_giao_hang}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setTripToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryTripsPage;