import { useState, useEffect } from 'react';
import { driverAPI } from '../api/services.js';
// Import Components
import DriverTable from '../components/driver/DriverTable.jsx';
import DriverForm from '../components/driver/DriverForm.jsx';
import DriverDetailsModal from '../components/driver/DriverDetailsModal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Sidebar from '../components/layout/SideBar.jsx'; 
import { useAuth } from '../context/AuthContext';   
import { useNavigate } from 'react-router-dom';     

import './DriversPage.css';

// 1. Import Feather Icons (Thêm Search vào đây)
import { User, Plus, LogOut, X, Search } from 'react-feather';

const DriversPage = () => {
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [viewingDriver, setViewingDriver] = useState(null);
  const [deletingDriver, setDeletingDriver] = useState(null);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverAPI.getAll();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err?.response?.data?.message || 'Không thể tải danh sách tài xế');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);
  const handleCreate = () => { setEditingDriver(null); setShowForm(true); };
  const handleEdit = (driver) => { setEditingDriver(driver); setShowForm(true); };
  
  const handleView = async (driver) => {
    try {
      const response = await driverAPI.getById(driver.DriverID);
      const fullDriver = response.data || response;
      setViewingDriver(fullDriver);
    } catch (err) {
      console.error('Error fetching driver details:', err);
      alert('❌ Không thể tải thông tin tài xế');
    }
  };

  const handleFormSubmit = async (driverData) => {
    try {
      if (editingDriver) {
        await driverAPI.update(editingDriver.DriverID, driverData);
        alert('✅ Cập nhật tài xế thành công!');
      } else {
        await driverAPI.create(driverData);
        alert('✅ Tạo tài xế mới thành công!');
      }
      await fetchDrivers();
      setShowForm(false);
      setEditingDriver(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('❌ Lỗi: ' + (err?.response?.data?.message || 'Không thể lưu thông tin'));
    }
  };

  const handleDeleteClick = (driver) => { setDeletingDriver(driver); };

  const handleDeleteConfirm = async () => {
    try {
      await driverAPI.delete(deletingDriver.DriverID);
      alert('✅ Xóa tài xế thành công!');
      await fetchDrivers();
      setDeletingDriver(null);
    } catch (err) {
      console.error('Error deleting driver:', err);
      alert('❌ Lỗi: ' + (err?.response?.data?.message || 'Không thể xóa tài xế'));
    }
  };

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
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main-content">
        <div className="drivers-page">
          
          {/* HEADER */}
          <div className="page-header">
            <div>
              <h1>
                  <User size={28} style={{marginRight: '10px', color: '#3B5998'}} />
                  Quản Lý Tài Xế
              </h1>
              <p>Danh sách {Array.isArray(drivers) ? drivers.length : 0} tài xế trong hệ thống</p>
            </div>
            
            <div className="header-actions">
                <button className="btn-primary" onClick={handleCreate}>
                    <Plus size={18} /> Thêm tài xế mới
                </button>
                
                <button className="btn-secondary" onClick={handleLogout}>
                    <LogOut size={16} /> Đăng xuất
                </button>
            </div>
          </div>

          {/* SEARCH BAR (ĐÃ SỬA) */}
          <div className="search-bar">
            {/* Icon Search Feather nằm bên trái */}
            <Search className="search-icon" size={18} />
            
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, hoặc CCCD..." /* Xóa emoji ở đây */
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {searchTerm && (
              <button className="btn-clear" onClick={() => setSearchTerm('')}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* LOADING / ERROR */}
          {loading && (
            <div className="loading">⏳ Đang tải...</div>
          )}
          {error && (
            <div className="error">
              <p>❌ {error}</p>
              <button className="btn-primary" onClick={fetchDrivers}>Thử lại</button>
            </div>
          )}

          {/* TABLE */}
          {!loading && !error && (
            <DriverTable
              drivers={filteredDrivers}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}

          {/* NO RESULTS */}
          {!loading && !error && filteredDrivers.length === 0 && (
            <div className="no-results">
              <Search size={48} color="#cbd5e1" strokeWidth={1} style={{marginBottom: '16px'}}/>
              <p>Không tìm thấy tài xế nào</p>
            </div>
          )}

          {/* FORM MODAL */}
          {showForm && (
            <DriverForm
              driver={editingDriver}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingDriver(null);
              }}
            />
          )}

          {/* VIEW MODAL */}
          {viewingDriver && (
            <DriverDetailsModal 
              driver={viewingDriver} 
              onClose={() => setViewingDriver(null)} 
            />
          )}

          {/* DELETE CONFIRM */}
          {deletingDriver && (
            <ConfirmDialog
              title="Xác nhận xóa"
              message={`Bạn có chắc muốn xóa tài xế "${deletingDriver.Ho_ten}" (${deletingDriver.DriverID})?`}
              onConfirm={handleDeleteConfirm}
              onCancel={() => setDeletingDriver(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DriversPage;