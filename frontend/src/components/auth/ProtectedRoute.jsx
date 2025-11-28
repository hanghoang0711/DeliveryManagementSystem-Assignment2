import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PROTECTED ROUTE COMPONENT
 * Chỉ cho phép user đã login truy cập
 * Nếu chưa login -> redirect về /login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Đang load authentication state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Chưa đăng nhập -> redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập -> render children
  return children;
};

export default ProtectedRoute;