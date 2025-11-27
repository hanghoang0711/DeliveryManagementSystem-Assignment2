import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/services';

// Tạo Context
const AuthContext = createContext(null);

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AUTH PROVIDER COMPONENT
 * Quản lý state đăng nhập/đăng xuất global
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Kiểm tra token khi component mount
   */
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * ĐĂNG NHẬP
   */
  const login = async (username, password) => {
    try {
      setLoading(true);

      // Gọi API login
      const response = await authAPI.login({ username, password });

      // Lưu token và user info
      const { token, message } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));

      // Update state
      setToken(token);
      setUser({ username });
      setIsAuthenticated(true);

      console.log('✅ Login successful:', message);
      return { success: true, message };
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * ĐĂNG XUẤT
   */
  const logout = async () => {
    try {
      // Gọi API logout (optional)
      await authAPI.logout();

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Reset state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Vẫn logout ở client dù API lỗi
      localStorage.clear();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Value được share cho toàn bộ app
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



