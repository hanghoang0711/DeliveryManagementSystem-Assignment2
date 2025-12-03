import { useNavigate, useLocation } from 'react-router-dom';
import { Package, User, Truck, BarChart, Home } from 'react-feather';
import './SideBar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        { Icon: Home, title: 'Trang Chủ', path: '/dashboard' },
        { Icon: Package, title: 'Đơn hàng', desc: 'Quản lý đơn hàng', path: '/orders' },
        { Icon: User, title: 'Tài xế', desc: 'Quản lý tài xế', path: '/drivers' },
        { Icon: Truck, title: 'Chuyến giao hàng', desc: 'Quản lý chuyến', path: '/chuyen-giao-hang' },
        { Icon: BarChart, title: 'Báo cáo', desc: 'Thống kê', path: '/reports' }
    ];

    return (
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
    );
};

export default Sidebar;