import { useState, useEffect } from 'react';
import reportsAPI from '../services/reportsAPI';
import TopDriversCard from '../components/reports/TopDriversCard';
import TopCustomersCard from '../components/reports/TopCustomersCard';
import './ReportsPage.css';

const ReportsPage = () => {
  // State
  const [topDrivers, setTopDrivers] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [driverLimit, setDriverLimit] = useState(10);
  const [customerLimit, setCustomerLimit] = useState(10);

  /**
   * Fetch reports data
   */
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [driversData, customersData] = await Promise.all([
        reportsAPI.getTopDrivers({ limit: driverLimit }),
        reportsAPI.getTopCustomers({ limit: customerLimit })
      ]);

      console.log(customersData.data);

      setTopDrivers(driversData.data);
      setTopCustomers(customersData.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when limits change
  useEffect(() => {
    fetchReports();
  }, [driverLimit, customerLimit]);

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    fetchReports();
  };

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>📊 Báo cáo & Thống kê</h1>
          <p>Phân tích hiệu suất tài xế và khách hàng</p>
        </div>
        <button className="btn-primary" onClick={handleRefresh}>
          🔄 Làm mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải báo cáo...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={handleRefresh}>Thử lại</button>
        </div>
      )}

      {/* Reports Grid */}
      {!loading && !error && (
        <div className="reports-grid">
          {/* Top Drivers Card */}
          <TopDriversCard
            drivers={topDrivers}
            limit={driverLimit}
            onLimitChange={setDriverLimit}
          />

          {/* Top Customers Card */}
          <TopCustomersCard
            customers={topCustomers}
            limit={customerLimit}
            onLimitChange={setCustomerLimit}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;