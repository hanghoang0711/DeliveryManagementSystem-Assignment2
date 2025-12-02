import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import './DashboardPage.css';

// Import các Feather Icons needed
import { Package, User, Truck, BarChart, Home } from 'react-feather';

// Import ảnh banner
import bannerImage from '../assets/images/100.jpg'; 

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { Icon: Home, title: 'Trang Chủ', path: '/dashboard' },
        { Icon: Package, title: 'Đơn hàng', desc: 'Quản lý, theo dõi và tạo đơn hàng mới', path: '/orders' },
        { Icon: User, title: 'Tài xế', desc: 'Quản lý thông tin và phân công tài xế', path: '/drivers' },
        { Icon: Truck, title: 'Chuyến giao hàng', desc: 'Theo dõi lịch trình và trạng thái giao hàng', path: '/chuyen-giao-hang' },
        { Icon: BarChart, title: 'Báo cáo', desc: 'Xem thống kê hiệu suất và phân tích', path: '/reports' }
    ];
    
    const currentPath = location.pathname;

    // Logic tìm active menu item vẫn giữ lại để dùng cho class 'active' ở sidebar
    const activeMenuItem = menuItems.find(
        item => item.path === currentPath || (item.path === '/dashboard' && currentPath === '/')
    );
    
    // Không cần biến PageIcon và pageTitle nữa vì không hiển thị

    return (
        <div className="dashboard-container">
            
            {/* -------------------- SIDEBAR -------------------- */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="dashboard-brand">ALALA</div>
                </div>
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li 
                            key={item.path}
                            className={`menu-item ${item.path === currentPath || (item.path === '/dashboard' && currentPath === '/') ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <item.Icon />
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
            {/* ----------------- END SIDEBAR ----------------- */}


            {/* ----------------- MAIN CONTENT ----------------- */}
            <div className="dashboard-main-content">
                
                {/* --- HEADER MỚI (CHỈ CÒN CHỮ XIN CHÀO TO) --- */}
                <div className="dashboard-top">
                    <div className="dashboard-left">
                        {/* ĐÃ XÓA THẺ H1 */}
                        
                        {/* Chữ Xin chào to hơn */}
                        <p>
                            Xin chào, <strong>{user?.username || 'sManager'}</strong>!
                        </p>
                    </div>

                    <div className="dashboard-right">
                        <button className="btn-logout" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </div>
                {/* --- END HEADER --- */}


                {/* Banner Xe Tải - Nội dung chính cho Trang Chủ */}
                {currentPath === '/dashboard' || currentPath === '/' ? (
                    <div className="delivery-banner">
                        <div 
                            className="banner-image" 
                            style={{ backgroundImage: `url(${bannerImage})` }}
                        ></div>
                        
                        <div className="banner-text">
                            <h2>ALALA</h2>
                            <p>
                                Giải pháp vận chuyển thông minh, nhanh chóng và an toàn cho doanh nghiệp của bạn.
                            </p>
                            <button 
                                className="banner-action-button"
                                onClick={() => navigate('/orders')}
                            >
                                Quản Lý Ngay
                            </button>
                        </div>
                    </div>
                ) : (
                    // Placeholder cho các trang khác
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-gray)' }}>
                        <h2>Nội dung trang: {activeMenuItem?.title}</h2>
                        <p>(Chức năng đang được phát triển)</p>
                    </div>
                )}
            </div>
            {/* -------------- END MAIN CONTENT -------------- */}
        </div>
    );
};

export default DashboardPage;