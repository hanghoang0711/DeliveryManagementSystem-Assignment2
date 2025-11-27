import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1>🚚 Dashboard</h1>
          <p>Xin chào, <strong>{user?.username}</strong>!</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1 */}
        <div 
          onClick={() => navigate('/orders')}
          style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3>📦 Đơn hàng</h3>
          <p>Quản lý đơn hàng</p>
          <p style={{ color: '#155724', fontSize: '14px', fontWeight: 'bold' }}>
            ✅ Click to open (Stage 3 Complete!)
          </p>
        </div>

         {/* Card 2 - UPDATED with link */}
        <div 
          onClick={() => navigate('/drivers')}
          style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3>🚗 Tài xế</h3>
          <p>Quản lý tài xế</p>
          <p style={{ color: '#155724', fontSize: '14px', fontWeight: 'bold' }}>
            ✅ Click to open (Stage 2 Complete!)
          </p>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => navigate('/chuyen-giao-hang')}
          style={{ 
            padding: '20px', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          <h3>🚚 Chuyến giao hàng</h3>
          <p>Quản lý chuyến giao</p>
          <p style={{ color: '#0c5460', fontSize: '14px', fontWeight: 'bold' }}>
            ✅ Click to open (Stage 4 Complete!)
          </p>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => navigate('/reports')}
          style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          <h3>📊 Báo cáo</h3>
          <p>Thống kê & phân tích</p>
          <p style={{ color: '#856404', fontSize: '14px', fontWeight: 'bold' }}>
            ✅ Click to open (Stage 5 Complete!)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;