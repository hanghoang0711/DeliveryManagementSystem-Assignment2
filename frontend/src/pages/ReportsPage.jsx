import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import reportsAPI from '../services/reportsAPI';

// Components
import TopDriversCard from '../components/reports/TopDriversCard';
import TopCustomersCard from '../components/reports/TopCustomersCard';
import Sidebar from '../components/layout/SideBar';

// CSS
import './ReportsPage.css';

// Feather Icons
import { BarChart2, RefreshCw, LogOut } from 'react-feather';

const ReportsPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // State
    const [topDrivers, setTopDrivers] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [driverLimit, setDriverLimit] = useState(10);
    const [customerLimit, setCustomerLimit] = useState(10);

    const handleLogout = async () => { 
        await logout(); 
        navigate('/login'); 
    };

    /**
     * Fetch reports data
     */
    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const [driversData, customersData] = await Promise.all([
                reportsAPI.getTopDrivers({ topN: driverLimit }),
                reportsAPI.getTopCustomers({ topN: customerLimit })
            ]);

            // Kiểm tra cấu trúc dữ liệu trả về (data.data hoặc data.drivers/customers)
            setTopDrivers(driversData.data || driversData.drivers || []);
            setTopCustomers(customersData.data || customersData.customers || []);
            
        } catch (err) {
            console.error("Report fetch error:", err);
            setError(err.response?.data?.message || 'Không thể tải báo cáo');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when limits change
    useEffect(() => {
        fetchReports();
    }, [driverLimit, customerLimit]);

    const handleRefresh = () => {
        fetchReports();
    };

    return (
        <div className="dashboard-container">
            {/* 1. Sidebar */}
            <Sidebar />

            <div className="dashboard-main-content">
                <div className="reports-page">
                    
                    {/* 2. Header mới */}
                    <div className="page-header">
                        <div>
                            <h1>
                                <BarChart2 size={28} color="#3B5998" />
                                Báo cáo & Thống kê
                            </h1>
                            <p>Phân tích hiệu suất hệ thống của <strong>{user?.username}</strong></p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-primary" onClick={handleRefresh}>
                                <RefreshCw size={16} /> Làm mới
                            </button>
                            <button className="btn-secondary" onClick={handleLogout}>
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
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
                            <button className="btn-primary" onClick={handleRefresh}>Thử lại</button>
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
            </div>
        </div>
    );
};

export default ReportsPage;