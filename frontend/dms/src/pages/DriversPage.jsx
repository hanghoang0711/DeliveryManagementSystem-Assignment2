// src/pages/DriversPage.jsx
import { useState, useEffect } from 'react';
import { driverAPI } from '../api/services.js';
import DriverTable from '../components/driver/DriverTable.jsx';
import DriverForm from '../components/driver/DriverForm.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import './DriversPage.css';

const DriversPage = () => {
  // State management
  const [drivers, setDrivers] = useState([]);      // luôn cố gắng giữ là array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deletingDriver, setDeletingDriver] = useState(null);

  /**
   * Fetch drivers từ API
   */
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await driverAPI.getAll();
      console.log('🚗 Drivers from API:', data);

      // Đảm bảo luôn là array
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err?.response?.data?.message || 'Không thể tải danh sách tài xế');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load drivers khi component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  /**
   * Xử lý tạo tài xế mới
   */
  const handleCreate = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  /**
   * Xử lý edit tài xế
   */
  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  /**
   * Xử lý submit form (create hoặc update)
   */
  const handleFormSubmit = async (driverData) => {
    try {
      if (editingDriver) {
        // Update existing driver
        await driverAPI.update(editingDriver.DriverID, driverData);
        alert('✅ Cập nhật tài xế thành công!');
      } else {
        // Create new driver
        await driverAPI.create(driverData);
        alert('✅ Tạo tài xế mới thành công!');
      }

      // Refresh list
      await fetchDrivers();

      // Close form
      setShowForm(false);
      setEditingDriver(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('❌ Lỗi: ' + (err?.response?.data?.message || 'Không thể lưu thông tin'));
      // Không throw nữa để tránh crash
    }
  };

  /**
   * Xử lý xóa tài xế
   */
  const handleDeleteClick = (driver) => {
    setDeletingDriver(driver);
  };

  const handleDeleteConfirm = async () => {
    try {
      await driverAPI.delete(deletingDriver.DriverID);
      alert('✅ Xóa tài xế thành công!');

      // Refresh list
      await fetchDrivers();

      // Close dialog
      setDeletingDriver(null);
    } catch (err) {
      console.error('Error deleting driver:', err);
      alert('❌ Lỗi: ' + (err?.response?.data?.message || 'Không thể xóa tài xế'));
    }
  };

  /**
   * Filter drivers theo search term
   * Luôn kiểm tra drivers có phải array không để tránh lỗi .filter
   */
  const filteredDrivers = Array.isArray(drivers)
    ? drivers.filter((driver) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          driver.DriverID?.toLowerCase().includes(searchLower) ||
          driver.Ho_ten?.toLowerCase().includes(searchLower) ||
          driver.CCCD?.includes(searchTerm)
        );
      })
    : [];

  return (
    <div className="drivers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>🚗 Quản Lý Tài Xế</h1>
          <p>Danh sách {Array.isArray(drivers) ? drivers.length : 0} tài xế trong hệ thống</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          ➕ Thêm tài xế mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo mã, tên, hoặc CCCD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="btn-clear"
            onClick={() => setSearchTerm('')}
          >
            ✖️
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={fetchDrivers}>Thử lại</button>
        </div>
      )}

      {/* Driver Table */}
      {!loading && !error && (
        <DriverTable
          drivers={filteredDrivers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* No Results */}
      {!loading && !error && filteredDrivers.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy tài xế nào</p>
        </div>
      )}

      {/* Driver Form Modal */}
      {showForm && (
        <DriverForm
          driver={editingDriver}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingDriver(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingDriver && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa tài xế "${deletingDriver.Ho_ten}" (${deletingDriver.DriverID})?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingDriver(null)}
        />
      )}
    </div>
  );
};

export default DriversPage;
