import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { title: '📦 Đơn hàng', desc: 'Quản lý đơn hàng', color: 'green', path: '/orders' },
    { title: '🚗 Tài xế', desc: 'Quản lý tài xế', color: 'blue', path: '/drivers' },
    { title: '🚚 Chuyến giao hàng', desc: 'Quản lý chuyến giao', color: 'cyan', path: '/chuyen-giao-hang' },
    { title: '📊 Báo cáo', desc: 'Thống kê & phân tích', color: 'yellow', path: '/reports' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        <div className="dashboard-left">
          <h1>
            <span role="img" aria-label="truck">🚚</span>
            Dashboard
          </h1>
          <p>
            Xin chào, <strong>{user?.username || 'sManager'}</strong>!
          </p>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-brand">
            <div className="dashboard-brand-icon"></div>
            <div className="dashboard-brand-text">SHIPIZ</div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`dashboard-card card-${item.color}`}
            onClick={() => navigate(item.path)}
          >
            <h3>
              <span role="img" aria-label="icon">{item.title.split(' ')[0]}</span>
              {item.title.substring(item.title.indexOf(' ') + 1)}
            </h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
