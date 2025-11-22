# 🎨 FRONTEND IMPLEMENTATION GUIDE

> **Hướng dẫn chi tiết từng bước tích hợp backend API vào frontend**  
> **📋 Chia thành 6 giai đoạn nhỏ để dễ thực hiện**

---

## 📚 MỤC LỤC

- [Giai đoạn 1: Setup & Authentication](#giai-đoạn-1-setup--authentication) ✅
- [Giai đoạn 2: Driver Management](#giai-đoạn-2-driver-management) ✅
- [Giai đoạn 3: Order Management](#giai-đoạn-3-order-management) ✅
- [Giai đoạn 4: Delivery Trip Management](#giai-đoạn-4-delivery-trip-management) ✅
- [Giai đoạn 5: Reports & Analytics](#giai-đoạn-5-reports--analytics) ✅
- [Giai đoạn 6: Advanced Features & Optimization](#giai-đoạn-6-advanced-features--optimization) ✅

---

# GIAI ĐOẠN 1: SETUP & AUTHENTICATION

> **Mục tiêu:** Setup project cơ bản, cấu hình Axios, implement login/logout flow   
> **Dependencies:** React, Axios, React Router

---

## 📦 Bước 1.1: Cài đặt Dependencies

```bash
# Trong thư mục frontend
npm install axios react-router-dom
```

---

## 📁 Bước 1.2: Tạo cấu trúc thư mục

```
src/
├── api/
│   ├── axios.js          # Axios instance với interceptors
│   └── services.js       # API service functions
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
├── pages/
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── context/
│   └── AuthContext.jsx   # Auth state management
└── utils/
    └── constants.js      # Constants (API URLs, statuses)
```

---

## 🔧 Bước 1.3: Tạo Axios Instance với Interceptors

**File: `src/api/axios.js`**

```javascript
import axios from 'axios';

// Base URL của backend API
const BASE_URL = 'http://localhost:3000';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * REQUEST INTERCEPTOR
 * Tự động thêm JWT token vào header của mọi request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token, thêm vào Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Xử lý response và error tự động
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // Xử lý 401 Unauthorized - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.warn('🔒 Token expired or invalid. Redirecting to login...');
      
      // Xóa token và redirect về login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Xử lý 403 Forbidden
    if (error.response?.status === 403) {
      console.error('🚫 Access denied');
    }
    
    // Xử lý 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('💥 Server error');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 📡 Bước 1.4: Tạo Authentication API Services

**File: `src/api/services.js`**

```javascript
import axios from './axios';

/**
 * ==========================================
 * AUTHENTICATION API SERVICES
 * ==========================================
 */
export const authAPI = {
  /**
   * Đăng nhập
   * @param {Object} credentials - {username, password}
   * @returns {Promise} Response chứa token
   */
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đăng xuất
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const response = await axios.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Test route admin (kiểm tra token có hợp lệ không)
   * @returns {Promise}
   */
  testAdmin: async () => {
    try {
      const response = await axios.get('/api/auth/admin');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export để sử dụng ở các file khác
export default {
  authAPI
};
```

---

## 🎯 Bước 1.5: Tạo Auth Context (Global State)

**File: `src/context/AuthContext.jsx`**

```javascript
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
```

---

## 🔒 Bước 1.6: Tạo Protected Route Component

**File: `src/components/auth/ProtectedRoute.jsx`**

```javascript
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
```

---

## 📄 Bước 1.7: Tạo Login Page

**File: `src/pages/LoginPage.jsx`**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // CSS riêng cho page này

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error khi user type
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Call login API
    const result = await login(formData.username, formData.password);

    if (result.success) {
      // Login thành công -> redirect về dashboard
      navigate('/dashboard');
    } else {
      // Login thất bại -> hiển thị error
      setError(result.message);
    }
  };

  /**
   * Auto-fill demo account
   */
  const fillDemoAccount = () => {
    setFormData({
      username: 'sManager',
      password: 'Nhom6251'
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1>🚚 Delivery Management</h1>
            <p>Hệ thống quản lý giao hàng</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            {/* Demo Account Button */}
            <button 
              type="button" 
              className="btn-demo"
              onClick={fillDemoAccount}
              disabled={loading}
            >
              Sử dụng tài khoản demo
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>Demo Account:</p>
            <p><strong>Username:</strong> sManager</p>
            <p><strong>Password:</strong> Nhom6251</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

## 🎨 Bước 1.8: CSS cho Login Page

**File: `src/pages/LoginPage.css`**

```css
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.btn-login {
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-demo {
  padding: 12px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-demo:hover:not(:disabled) {
  background-color: #667eea;
  color: white;
}

.btn-demo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #666;
  font-size: 13px;
}

.login-footer p {
  margin: 5px 0;
}

.login-footer strong {
  color: #333;
}
```

---

## 🏠 Bước 1.9: Tạo Dashboard Page (Simple)

**File: `src/pages/DashboardPage.jsx`**

```javascript
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
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📦 Đơn hàng</h3>
          <p>Quản lý đơn hàng</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 3</p>
        </div>

        {/* Card 2 */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>🚗 Tài xế</h3>
          <p>Quản lý tài xế</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 2</p>
        </div>

        {/* Card 3 */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>🚚 Chuyến giao hàng</h3>
          <p>Quản lý chuyến giao</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 4</p>
        </div>

        {/* Card 4 */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📊 Báo cáo</h3>
          <p>Thống kê & báo cáo</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 5</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#d4edda',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h3>✅ Stage 1 Complete!</h3>
        <p>Authentication đã hoạt động. Bạn đã đăng nhập thành công!</p>
        <p>Token được lưu tự động và sẽ được gửi kèm mọi request.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
```

---

## 🚀 Bước 1.10: Setup Routes trong App.jsx

**File: `src/App.jsx`**

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Bước 1.11: Test Authentication Flow

### Test Checklist:

1. **Start Backend Server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login Flow:**
   - [ ] Mở http://localhost:5173/login
   - [ ] Click "Sử dụng tài khoản demo" → auto fill credentials
   - [ ] Click "Đăng nhập"
   - [ ] Kiểm tra redirect về /dashboard
   - [ ] Kiểm tra localStorage có token
   - [ ] Mở DevTools Console → Xem log request/response

4. **Test Protected Route:**
   - [ ] Logout
   - [ ] Truy cập trực tiếp http://localhost:5173/dashboard
   - [ ] Verify redirect về /login

5. **Test Token Expiration:**
   - [ ] Login
   - [ ] Đợi 1 giờ (hoặc sửa token expire time ngắn hơn)
   - [ ] Refresh page
   - [ ] Verify auto redirect về /login

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 1

✅ **Đã hoàn thành:**
- Setup Axios instance với interceptors
- Implement token management
- Tạo Auth Context (Global state)
- Tạo Protected Route
- Tạo Login Page với UI đẹp
- Tạo Dashboard Page cơ bản
- Setup routing

✅ **Có thể làm:**
- Đăng nhập với username/password
- Token tự động được thêm vào mọi request
- Auto redirect khi token expire
- Đăng xuất

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Token Storage:** Đang dùng `localStorage`. Nếu cần bảo mật cao hơn, xem xét:
   - `sessionStorage` (token mất khi đóng tab)
   - HTTP-only cookies (backend handle)

2. **Error Handling:** Đã có basic error handling. Stage sau sẽ thêm:
   - Toast notifications
   - Global error boundary

3. **Loading States:** Đã có loading state trong AuthContext

---

## ⏭️ TIẾP THEO

**GIAI ĐOẠN 2: DRIVER MANAGEMENT** 🚗  
Implement CRUD operations cho quản lý tài xế với table, form, pagination.

---

# GIAI ĐOẠN 2: DRIVER MANAGEMENT

> **Mục tiêu:** Implement full CRUD operations cho quản lý tài xế  
> **Features:** Table view, Create/Edit form, Delete confirmation, Search, Pagination

---

## 📡 Bước 2.1: Thêm Driver API Services

**File: `src/api/services.js` (Thêm vào cuối file)**

```javascript
/**
 * ==========================================
 * DRIVER MANAGEMENT API SERVICES
 * ==========================================
 */
export const driverAPI = {
  /**
   * Lấy danh sách tất cả tài xế
   * @returns {Promise} Array of drivers
   */
  getAll: async () => {
    try {
      const response = await axios.get('/api/driver');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin tài xế theo ID
   * @param {string} id - Driver ID
   * @returns {Promise} Driver object
   */
  getById: async (id) => {
    try {
      const response = await axios.get(`/api/driver/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo tài xế mới
   * @param {Object} driverData - Driver information
   * @returns {Promise} Created driver
   */
  create: async (driverData) => {
    try {
      const response = await axios.post('/api/driver', driverData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật thông tin tài xế
   * @param {string} id - Driver ID
   * @param {Object} driverData - Updated data
   * @returns {Promise} Updated driver
   */
  update: async (id, driverData) => {
    try {
      const response = await axios.put(`/api/driver/${id}`, driverData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa tài xế
   * @param {string} id - Driver ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await axios.delete(`/api/driver/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Update default export
export default {
  authAPI,
  driverAPI
};
```

---

## 📄 Bước 2.2: Tạo Drivers List Page

**File: `src/pages/DriversPage.jsx`**

```javascript
import { useState, useEffect } from 'react';
import { driverAPI } from '../api/services';
import DriverTable from '../components/driver/DriverTable';
import DriverForm from '../components/driver/DriverForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './DriversPage.css';

const DriversPage = () => {
  // State management
  const [drivers, setDrivers] = useState([]);
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
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách tài xế');
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
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể lưu thông tin'));
      throw err; // Để form biết có lỗi
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
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa tài xế'));
    }
  };

  /**
   * Filter drivers theo search term
   */
  const filteredDrivers = drivers.filter(driver => {
    const searchLower = searchTerm.toLowerCase();
    return (
      driver.DriverID?.toLowerCase().includes(searchLower) ||
      driver.Ho_ten?.toLowerCase().includes(searchLower) ||
      driver.CCCD?.includes(searchTerm)
    );
  });

  return (
    <div className="drivers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>🚗 Quản Lý Tài Xế</h1>
          <p>Danh sách {drivers.length} tài xế trong hệ thống</p>
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
      {error && (
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
```

---

## 📊 Bước 2.3: Tạo Driver Table Component

**File: `src/components/driver/DriverTable.jsx`**

```javascript
import './DriverTable.css';

const DriverTable = ({ drivers, onEdit, onDelete }) => {
  /**
   * Format rating với sao
   */
  const formatRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return `${stars} ${rating.toFixed(1)}`;
  };

  /**
   * Get badge class theo trạng thái
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'badge-success';
      case 'Không hoạt động':
        return 'badge-danger';
      case 'Tạm nghỉ':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="table-container">
      <table className="driver-table">
        <thead>
          <tr>
            <th>Mã TXế</th>
            <th>Họ tên</th>
            <th>CCCD</th>
            <th>Rating</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.DriverID}>
              <td>
                <span className="driver-id">{driver.DriverID}</span>
              </td>
              <td>
                <strong>{driver.Ho_ten}</strong>
              </td>
              <td>{driver.CCCD}</td>
              <td>{formatRating(driver.Rating || 0)}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(driver.Trang_thai_hoat_dong)}`}>
                  {driver.Trang_thai_hoat_dong}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(driver)}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(driver)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {drivers.length === 0 && (
        <div className="empty-state">
          <p>Chưa có tài xế nào</p>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
```

**File: `src/components/driver/DriverTable.css`**

```css
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.driver-table {
  width: 100%;
  border-collapse: collapse;
}

.driver-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.driver-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.driver-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.driver-table tbody tr:hover {
  background-color: #f8f9fa;
}

.driver-table td {
  padding: 12px 15px;
  font-size: 14px;
}

.driver-id {
  font-family: monospace;
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

/* Badge Styles */
.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-warning {
  background-color: #fff3cd;
  color: #856404;
}

.badge-secondary {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-edit {
  background-color: #fff3cd;
}

.btn-delete {
  background-color: #f8d7da;
}

.btn-edit:hover,
.btn-delete:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
```

---

## 📝 Bước 2.4: Tạo Driver Form Component

**File: `src/components/driver/DriverForm.jsx`**

```javascript
import { useState, useEffect } from 'react';
import './DriverForm.css';

const DriverForm = ({ driver, onSubmit, onClose }) => {
  // Form state
  const [formData, setFormData] = useState({
    DriverID: '',
    Ho_ten: '',
    CCCD: '',
    Rating: 4.0,
    Trang_thai_hoat_dong: 'Đang hoạt động'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load driver data khi edit mode
  useEffect(() => {
    if (driver) {
      setFormData({
        DriverID: driver.DriverID || '',
        Ho_ten: driver.Ho_ten || '',
        CCCD: driver.CCCD || '',
        Rating: driver.Rating || 4.0,
        Trang_thai_hoat_dong: driver.Trang_thai_hoat_dong || 'Đang hoạt động'
      });
    }
  }, [driver]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.DriverID.trim()) {
      newErrors.DriverID = 'Mã tài xế không được để trống';
    } else if (!/^DRV\d{3}$/.test(formData.DriverID)) {
      newErrors.DriverID = 'Mã tài xế phải có định dạng DRVxxx (ví dụ: DRV001)';
    }

    if (!formData.Ho_ten.trim()) {
      newErrors.Ho_ten = 'Họ tên không được để trống';
    } else if (formData.Ho_ten.trim().length < 3) {
      newErrors.Ho_ten = 'Họ tên phải có ít nhất 3 ký tự';
    }

    if (!formData.CCCD.trim()) {
      newErrors.CCCD = 'CCCD không được để trống';
    } else if (!/^\d{12}$/.test(formData.CCCD)) {
      newErrors.CCCD = 'CCCD phải có 12 chữ số';
    }

    if (formData.Rating < 0 || formData.Rating > 5) {
      newErrors.Rating = 'Rating phải từ 0 đến 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
      // onSubmit sẽ handle thành công và đóng form
    } catch (error) {
      // Error đã được handle trong parent component
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = !!driver;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEditMode ? '✏️ Sửa thông tin tài xế' : '➕ Thêm tài xế mới'}</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="driver-form">
          {/* Driver ID */}
          <div className="form-group">
            <label htmlFor="DriverID">
              Mã tài xế <span className="required">*</span>
            </label>
            <input
              type="text"
              id="DriverID"
              name="DriverID"
              value={formData.DriverID}
              onChange={handleChange}
              placeholder="DRV001"
              disabled={isEditMode} // Không cho edit ID
              className={errors.DriverID ? 'input-error' : ''}
            />
            {errors.DriverID && (
              <span className="error-message">{errors.DriverID}</span>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="Ho_ten">
              Họ tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="Ho_ten"
              name="Ho_ten"
              value={formData.Ho_ten}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={errors.Ho_ten ? 'input-error' : ''}
            />
            {errors.Ho_ten && (
              <span className="error-message">{errors.Ho_ten}</span>
            )}
          </div>

          {/* CCCD */}
          <div className="form-group">
            <label htmlFor="CCCD">
              CCCD <span className="required">*</span>
            </label>
            <input
              type="text"
              id="CCCD"
              name="CCCD"
              value={formData.CCCD}
              onChange={handleChange}
              placeholder="001234567890"
              maxLength="12"
              className={errors.CCCD ? 'input-error' : ''}
            />
            {errors.CCCD && (
              <span className="error-message">{errors.CCCD}</span>
            )}
          </div>

          {/* Rating */}
          <div className="form-group">
            <label htmlFor="Rating">
              Rating (0-5) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="Rating"
              name="Rating"
              value={formData.Rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className={errors.Rating ? 'input-error' : ''}
            />
            {errors.Rating && (
              <span className="error-message">{errors.Rating}</span>
            )}
            <small className="help-text">Điểm đánh giá từ 0.0 đến 5.0</small>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="Trang_thai_hoat_dong">
              Trạng thái <span className="required">*</span>
            </label>
            <select
              id="Trang_thai_hoat_dong"
              name="Trang_thai_hoat_dong"
              value={formData.Trang_thai_hoat_dong}
              onChange={handleChange}
            >
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
              <option value="Tạm nghỉ">Tạm nghỉ</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
```

**File: `src/components/driver/DriverForm.css`**

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #333;
}

.driver-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  border-color: #dc3545 !important;
}

.error-message {
  display: block;
  margin-top: 6px;
  color: #dc3545;
  font-size: 13px;
}

.help-text {
  display: block;
  margin-top: 6px;
  color: #666;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #d0d0d0;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 💬 Bước 2.5: Tạo Confirm Dialog Component

**File: `src/components/common/ConfirmDialog.jsx`**

```javascript
import './ConfirmDialog.css';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
```

**File: `src/components/common/ConfirmDialog.css`**

```css
.confirm-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

.confirm-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.confirm-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.confirm-body {
  padding: 20px;
}

.confirm-body p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.confirm-actions .btn-cancel,
.confirm-actions .btn-confirm {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-actions .btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.confirm-actions .btn-cancel:hover {
  background-color: #d0d0d0;
}

.confirm-actions .btn-confirm {
  background-color: #dc3545;
  color: white;
}

.confirm-actions .btn-confirm:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}
```

---

## 🎨 Bước 2.6: CSS cho Drivers Page

**File: `src/pages/DriversPage.css`**

```css
.drivers-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  margin: 0 0 5px 0;
  font-size: 32px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.search-bar {
  margin-bottom: 20px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 14px 50px 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.search-bar input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 5px 10px;
}

.btn-clear:hover {
  color: #333;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  margin-top: 20px;
  color: #666;
}

.error-container {
  padding: 40px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

.error-container p {
  color: #dc3545;
  margin-bottom: 20px;
}

.error-container button {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.no-results {
  padding: 40px;
  background: white;
  border-radius: 8px;
  text-align: center;
  color: #999;
}
```

---

## 🔗 Bước 2.7: Update Routes

**File: `src/App.jsx` (Update Routes)**

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DriversPage from './pages/DriversPage'; // NEW

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* NEW: Drivers Page */}
          <Route 
            path="/drivers" 
            element={
              <ProtectedRoute>
                <DriversPage />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🏠 Bước 2.8: Update Dashboard với Link

**File: `src/pages/DashboardPage.jsx` (Update Card 2)**

```javascript
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
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📦 Đơn hàng</h3>
          <p>Quản lý đơn hàng</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 3</p>
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
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>🚚 Chuyến giao hàng</h3>
          <p>Quản lý chuyến giao</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 4</p>
        </div>

        {/* Card 4 */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📊 Báo cáo</h3>
          <p>Thống kê & báo cáo</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Coming in Stage 5</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
```

---

## ✅ Bước 2.9: Test Driver Management

### Test Checklist:

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Test Cases:**

1. **View Drivers List:**
   - [ ] Click "Tài xế" card từ dashboard
   - [ ] Verify table hiển thị danh sách tài xế
   - [ ] Check pagination (nếu có > 10 records)

2. **Create New Driver:**
   - [ ] Click "➕ Thêm tài xế mới"
   - [ ] Fill form với data hợp lệ:
     ```
     DriverID: DRV999
     Ho_ten: Test Driver
     CCCD: 123456789012
     Rating: 4.5
     Status: Đang hoạt động
     ```
   - [ ] Click "Tạo mới"
   - [ ] Verify alert thành công
   - [ ] Verify driver mới xuất hiện trong table

3. **Validation Test:**
   - [ ] Thử submit form với DriverID sai format (ví dụ: "ABC123")
   - [ ] Verify error message xuất hiện
   - [ ] Thử submit với CCCD không đủ 12 số
   - [ ] Verify validation error

4. **Edit Driver:**
   - [ ] Click ✏️ button trên 1 driver
   - [ ] Verify form mở với data pre-filled
   - [ ] Change "Ho_ten" và "Rating"
   - [ ] Click "Cập nhật"
   - [ ] Verify changes reflected trong table

5. **Delete Driver:**
   - [ ] Click 🗑️ button
   - [ ] Verify confirm dialog xuất hiện
   - [ ] Click "Xác nhận"
   - [ ] Verify alert thành công
   - [ ] Verify driver bị xóa khỏi table

6. **Search Functionality:**
   - [ ] Type "DRV001" vào search box
   - [ ] Verify chỉ hiển thị drivers matching search
   - [ ] Clear search
   - [ ] Verify full list trở lại

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 2

✅ **Đã hoàn thành:**
- Driver API services (GET, POST, PUT, DELETE)
- DriversPage với state management
- DriverTable component với sorting & actions
- DriverForm với validation
- ConfirmDialog component
- Search functionality
- Full CRUD operations
- Error handling
- Loading states

✅ **Features hoạt động:**
- Xem danh sách tài xế
- Tạo tài xế mới
- Sửa thông tin tài xế
- Xóa tài xế với confirmation
- Tìm kiếm tài xế
- Validation form đầy đủ
- Responsive UI

---

## 💡 TIPS & BEST PRACTICES

1. **State Management:** Đang dùng local state. Nếu app phức tạp hơn, xem xét:
   - Redux Toolkit
   - Zustand
   - React Query (cho API calls)

2. **Form Validation:** Có thể improve bằng:
   - Yup schema validation
   - React Hook Form

3. **Error Handling:** Có thể thêm:
   - Toast notifications (react-toastify)
   - Better error messages

---

## ⏭️ TIẾP THEO

**GIAI ĐOẠN 3: ORDER MANAGEMENT** 📦  
Implement quản lý đơn hàng với:
- 11 order statuses
- Auto shipping calculation
- Advanced filtering & sorting
- Status update workflow

---

# GIAI ĐOẠN 3: ORDER MANAGEMENT

> **Mục tiêu:** Implement quản lý đơn hàng 
> **Features:** 11 statuses, Auto shipping calculation, Advanced filtering, Status workflow

---

## 🎯 Tính Năng Đặc Biệt

1. **11 Order Statuses** - Workflow đầy đủ từ tạo đến hoàn thành
2. **Auto Shipping Calculation** - 4 fields tự động tính toán
3. **Advanced Filtering** - Filter theo status, customer, date range
4. **Sorting** - Sort theo quang_duong, phi_van_chuyen, thoi_gian
5. **Pagination** - Handle large datasets
6. **Status Workflow** - Validate chuyển trạng thái hợp lệ

---

## 📡 Bước 3.1: Thêm Order API Services

**File: `src/api/services.js` (Thêm vào cuối file)**

```javascript
/**
 * ==========================================
 * ORDER MANAGEMENT API SERVICES
 * ==========================================
 */
export const orderAPI = {
  /**
   * Lấy danh sách đơn hàng với filter, sort, pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated orders
   */
  getAll: async (params = {}) => {
    try {
      const response = await axios.get('/api/don-hang', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin đơn hàng theo ID
   * @param {string} id - Order ID
   * @returns {Promise} Order object with customer info
   */
  getById: async (id) => {
    try {
      const response = await axios.get(`/api/don-hang/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo đơn hàng mới (Auto calculate shipping)
   * @param {Object} orderData - Order information
   * @returns {Promise} Created order with calculated fields
   */
  create: async (orderData) => {
    try {
      const response = await axios.post('/api/don-hang', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật đơn hàng (chủ yếu update status)
   * @param {string} id - Order ID
   * @param {Object} orderData - Updated data
   * @returns {Promise} Updated order
   */
  update: async (id, orderData) => {
    try {
      const response = await axios.put(`/api/don-hang/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa đơn hàng
   * @param {string} id - Order ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await axios.delete(`/api/don-hang/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Update default export
export default {
  authAPI,
  driverAPI,
  orderAPI
};
```

---

## 📋 Bước 3.2: Tạo Constants File

**File: `src/utils/constants.js`**

```javascript
/**
 * ORDER STATUSES
 * 11 trạng thái đơn hàng theo workflow
 */
export const ORDER_STATUSES = [
  'Đang xử lý',
  'Đang tìm tài xế',
  'Đã tìm được tài xế',
  'Đang lấy hàng',
  'Lấy hàng thành công',
  'Lấy hàng thất bại',
  'Đang giao hàng',
  'Giao hàng thành công',
  'Giao hàng thất bại',
  'Đã hoàn về kho',
  'Đã hoàn thành'
];

/**
 * Status Badge Colors
 */
export const STATUS_COLORS = {
  'Đang xử lý': 'blue',
  'Đang tìm tài xế': 'orange',
  'Đã tìm được tài xế': 'cyan',
  'Đang lấy hàng': 'purple',
  'Lấy hàng thành công': 'green',
  'Lấy hàng thất bại': 'red',
  'Đang giao hàng': 'purple',
  'Giao hàng thành công': 'green',
  'Giao hàng thất bại': 'red',
  'Đã hoàn về kho': 'gray',
  'Đã hoàn thành': 'darkgreen'
};

/**
 * Status Workflow - Các trạng thái hợp lệ tiếp theo
 */
export const STATUS_WORKFLOW = {
  'Đang xử lý': ['Đang tìm tài xế'],
  'Đang tìm tài xế': ['Đã tìm được tài xế', 'Đang xử lý'],
  'Đã tìm được tài xế': ['Đang lấy hàng'],
  'Đang lấy hàng': ['Lấy hàng thành công', 'Lấy hàng thất bại'],
  'Lấy hàng thành công': ['Đang giao hàng'],
  'Lấy hàng thất bại': ['Đã hoàn về kho'],
  'Đang giao hàng': ['Giao hàng thành công', 'Giao hàng thất bại'],
  'Giao hàng thành công': ['Đã hoàn thành'],
  'Giao hàng thất bại': ['Đã hoàn về kho'],
  'Đã hoàn về kho': ['Đang xử lý'],
  'Đã hoàn thành': []
};

/**
 * Sort Fields
 */
export const ORDER_SORT_FIELDS = [
  { value: 'thoi_gian_dat_don', label: 'Thời gian đặt' },
  { value: 'Ma_don_hang', label: 'Mã đơn hàng' },
  { value: 'quang_duong', label: 'Quãng đường' },
  { value: 'phi_van_chuyen_sau_giam', label: 'Phí vận chuyển' },
  { value: 'gia_tri_hang_hoa_phi_van_chuyen', label: 'Giá trị hàng hóa' }
];

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format distance
 */
export const formatDistance = (km) => {
  return `${parseFloat(km).toFixed(2)} km`;
};
```

---

## 📄 Bước 3.3: Tạo Orders List Page

**File: `src/pages/OrdersPage.jsx`**

```javascript
import { useState, useEffect } from 'react';
import { orderAPI } from '../api/services';
import OrderTable from '../components/order/OrderTable';
import OrderForm from '../components/order/OrderForm';
import OrderFilter from '../components/order/OrderFilter';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import './OrdersPage.css';

const OrdersPage = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter state
  const [filters, setFilters] = useState({
    trang_thai_don: '',
    ma_khach_hang: '',
    sortKey: 'thoi_gian_dat_don',
    sortOrder: 'DESC'
  });

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  /**
   * Fetch orders từ API
   */
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      const data = await orderAPI.getAll(params);
      
      setOrders(data.data || []);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total,
        limit: data.pagination.limit
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Load orders khi component mount hoặc filters thay đổi
  useEffect(() => {
    fetchOrders(1);
  }, [filters]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  /**
   * Handle create new order
   */
  const handleCreate = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  /**
   * Handle view order details
   */
  const handleView = async (order) => {
    try {
      // Fetch full order details
      const fullOrder = await orderAPI.getById(order.Ma_don_hang);
      setViewingOrder(fullOrder);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('❌ Không thể tải thông tin đơn hàng');
    }
  };

  /**
   * Handle edit order (update status)
   */
  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (orderData) => {
    try {
      if (editingOrder) {
        // Update existing order (chủ yếu là status)
        await orderAPI.update(editingOrder.Ma_don_hang, orderData);
        alert('✅ Cập nhật đơn hàng thành công!');
      } else {
        // Create new order
        await orderAPI.create(orderData);
        alert('✅ Tạo đơn hàng mới thành công!');
      }
      
      // Refresh list
      await fetchOrders(pagination.currentPage);
      
      // Close form
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể lưu thông tin'));
      throw err;
    }
  };

  /**
   * Handle delete order
   */
  const handleDeleteClick = (order) => {
    setDeletingOrder(order);
  };

  const handleDeleteConfirm = async () => {
    try {
      await orderAPI.delete(deletingOrder.Ma_don_hang);
      alert('✅ Xóa đơn hàng thành công!');
      
      // Refresh list
      await fetchOrders(pagination.currentPage);
      
      // Close dialog
      setDeletingOrder(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa đơn hàng'));
    }
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>📦 Quản Lý Đơn Hàng</h1>
          <p>
            Tổng {pagination.total} đơn hàng 
            {filters.trang_thai_don && ` - Lọc: ${filters.trang_thai_don}`}
          </p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          ➕ Tạo đơn hàng mới
        </button>
      </div>

      {/* Filter Section */}
      <OrderFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => fetchOrders(pagination.currentPage)}>Thử lại</button>
        </div>
      )}

      {/* Order Table */}
      {!loading && !error && (
        <>
          <OrderTable
            orders={orders}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* No Results */}
      {!loading && !error && orders.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy đơn hàng nào</p>
        </div>
      )}

      {/* Order Form Modal */}
      {showForm && (
        <OrderForm
          order={editingOrder}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Chi tiết đơn hàng</h2>
              <button className="btn-close" onClick={() => setViewingOrder(null)}>✖️</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(viewingOrder, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingOrder && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa đơn hàng "${deletingOrder.Ma_don_hang}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
```

---

## 🎛️ Bước 3.4: Tạo Order Filter Component

**File: `src/components/order/OrderFilter.jsx`**

```javascript
import { ORDER_STATUSES, ORDER_SORT_FIELDS } from '../../utils/constants';
import './OrderFilter.css';

const OrderFilter = ({ filters, onFilterChange, loading }) => {
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      trang_thai_don: '',
      ma_khach_hang: '',
      sortKey: 'thoi_gian_dat_don',
      sortOrder: 'DESC'
    });
  };

  return (
    <div className="order-filter">
      <div className="filter-row">
        {/* Status Filter */}
        <div className="filter-group">
          <label>🏷️ Trạng thái:</label>
          <select
            value={filters.trang_thai_don}
            onChange={(e) => handleChange('trang_thai_don', e.target.value)}
            disabled={loading}
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Customer Filter */}
        <div className="filter-group">
          <label>👤 Khách hàng:</label>
          <input
            type="text"
            placeholder="Mã khách hàng (KH001)"
            value={filters.ma_khach_hang}
            onChange={(e) => handleChange('ma_khach_hang', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sort Field */}
        <div className="filter-group">
          <label>📊 Sắp xếp theo:</label>
          <select
            value={filters.sortKey}
            onChange={(e) => handleChange('sortKey', e.target.value)}
            disabled={loading}
          >
            {ORDER_SORT_FIELDS.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label>🔄 Thứ tự:</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
            disabled={loading}
          >
            <option value="ASC">Tăng dần</option>
            <option value="DESC">Giảm dần</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="filter-group">
          <button
            className="btn-reset"
            onClick={handleReset}
            disabled={loading}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
```

**File: `src/components/order/OrderFilter.css`**

```css
.order-filter {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.filter-group input,
.filter-group select {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #667eea;
}

.filter-group input:disabled,
.filter-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-reset {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-reset:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 📊 Bước 3.5: Tạo Order Table Component

**File: `src/components/order/OrderTable.jsx`**

```javascript
import { STATUS_COLORS, formatCurrency, formatDate, formatDistance } from '../../utils/constants';
import './OrderTable.css';

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
  /**
   * Get badge class theo trạng thái
   */
  const getStatusBadgeClass = (status) => {
    const color = STATUS_COLORS[status] || 'gray';
    return `badge-${color}`;
  };

  return (
    <div className="table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>Trạng thái</th>
            <th>Quãng đường</th>
            <th>Phí VC</th>
            <th>Giá trị</th>
            <th>Thời gian</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.Ma_don_hang}>
              <td>
                <span className="order-id">{order.Ma_don_hang}</span>
              </td>
              <td>
                <strong>{order.khachHang?.email || 'N/A'}</strong>
                <br />
                <small>{order.Ma_khach_hang}</small>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(order.Trang_thai_don)}`}>
                  {order.Trang_thai_don}
                </span>
              </td>
              <td>{formatDistance(order.quang_duong)}</td>
              <td>
                <div className="price-info">
                  <span className="original-price">
                    {formatCurrency(order.phi_van_chuyen_goc)}
                  </span>
                  {order.so_tien_duoc_giam > 0 && (
                    <>
                      <span className="discount">
                        -{formatCurrency(order.so_tien_duoc_giam)}
                      </span>
                      <span className="final-price">
                        {formatCurrency(order.phi_van_chuyen_sau_giam)}
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td>{formatCurrency(order.gia_tri_hang_hoa_phi_van_chuyen)}</td>
              <td>
                <small>{formatDate(order.thoi_gian_dat_don)}</small>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-view"
                    onClick={() => onView(order)}
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(order)}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(order)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="empty-state">
          <p>Chưa có đơn hàng nào</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
```

**File: `src/components/order/OrderTable.css`**

```css
.order-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.order-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.order-table th {
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
}

.order-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.order-table tbody tr:hover {
  background-color: #f8f9fa;
}

.order-table td {
  padding: 10px;
  font-size: 13px;
}

.order-id {
  font-family: monospace;
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

/* Status Badge Colors */
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  white-space: nowrap;
}

.badge-blue { background-color: #cfe2ff; color: #084298; }
.badge-orange { background-color: #ffe5b4; color: #856404; }
.badge-cyan { background-color: #cff4fc; color: #055160; }
.badge-purple { background-color: #e7d4f8; color: #6f42c1; }
.badge-green { background-color: #d4edda; color: #155724; }
.badge-red { background-color: #f8d7da; color: #721c24; }
.badge-gray { background-color: #e2e3e5; color: #383d41; }
.badge-darkgreen { background-color: #155724; color: white; }

/* Price Info */
.price-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.original-price {
  font-size: 12px;
  color: #666;
}

.discount {
  font-size: 11px;
  color: #dc3545;
  font-weight: 600;
}

.final-price {
  font-size: 13px;
  color: #155724;
  font-weight: 700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-view,
.btn-edit,
.btn-delete {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-view { background-color: #d1ecf1; }
.btn-edit { background-color: #fff3cd; }
.btn-delete { background-color: #f8d7da; }

.btn-view:hover,
.btn-edit:hover,
.btn-delete:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
```

---

**💬 Code đang dài, tôi sẽ tiếp tục phần còn lại (Order Form, Pagination, CSS) ở response tiếp theo. Bạn ready chứ?**

Nhắn **"tiếp"** để tôi viết tiếp OrderForm component, Pagination, và hoàn thiện giai đoạn 3! 🚀

---

## 📝 Bước 3.6: Tạo Order Form Component

**File: `src/components/order/OrderForm.jsx`**

```javascript
import { useState, useEffect } from 'react';
import { ORDER_STATUSES, STATUS_WORKFLOW } from '../../utils/constants';
import './OrderForm.css';

const OrderForm = ({ order, onSubmit, onClose }) => {
  // Form state
  const [formData, setFormData] = useState({
    Ma_khach_hang: '',
    dia_chi_lay_hang: '',
    dia_chi_giao_hang: '',
    SDT_nguoi_gui: '',
    ten_nguoi_gui: '',
    SDT_nguoi_nhan: '',
    ten_nguoi_nhan: '',
    gia_tri_hang_hoa_phi_van_chuyen: 0,
    ghi_chu: '',
    Trang_thai_don: 'Đang xử lý' // Default status for new orders
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!order;

  // Load order data khi edit mode
  useEffect(() => {
    if (order) {
      setFormData({
        Ma_khach_hang: order.Ma_khach_hang || '',
        dia_chi_lay_hang: order.dia_chi_lay_hang || '',
        dia_chi_giao_hang: order.dia_chi_giao_hang || '',
        SDT_nguoi_gui: order.SDT_nguoi_gui || '',
        ten_nguoi_gui: order.ten_nguoi_gui || '',
        SDT_nguoi_nhan: order.SDT_nguoi_nhan || '',
        ten_nguoi_nhan: order.ten_nguoi_nhan || '',
        gia_tri_hang_hoa_phi_van_chuyen: order.gia_tri_hang_hoa_phi_van_chuyen || 0,
        ghi_chu: order.ghi_chu || '',
        Trang_thai_don: order.Trang_thai_don || 'Đang xử lý'
      });
    }
  }, [order]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.Ma_khach_hang.trim()) {
      newErrors.Ma_khach_hang = 'Mã khách hàng không được để trống';
    } else if (!/^KH\d{3}$/.test(formData.Ma_khach_hang)) {
      newErrors.Ma_khach_hang = 'Mã khách hàng phải có định dạng KHxxx (ví dụ: KH001)';
    }

    if (!formData.dia_chi_lay_hang.trim()) {
      newErrors.dia_chi_lay_hang = 'Địa chỉ lấy hàng không được để trống';
    }

    if (!formData.dia_chi_giao_hang.trim()) {
      newErrors.dia_chi_giao_hang = 'Địa chỉ giao hàng không được để trống';
    }

    if (!formData.SDT_nguoi_gui.trim()) {
      newErrors.SDT_nguoi_gui = 'SĐT người gửi không được để trống';
    } else if (!/^0\d{9}$/.test(formData.SDT_nguoi_gui)) {
      newErrors.SDT_nguoi_gui = 'SĐT phải có 10 chữ số và bắt đầu bằng 0';
    }

    if (!formData.ten_nguoi_gui.trim()) {
      newErrors.ten_nguoi_gui = 'Tên người gửi không được để trống';
    }

    if (!formData.SDT_nguoi_nhan.trim()) {
      newErrors.SDT_nguoi_nhan = 'SĐT người nhận không được để trống';
    } else if (!/^0\d{9}$/.test(formData.SDT_nguoi_nhan)) {
      newErrors.SDT_nguoi_nhan = 'SĐT phải có 10 chữ số và bắt đầu bằng 0';
    }

    if (!formData.ten_nguoi_nhan.trim()) {
      newErrors.ten_nguoi_nhan = 'Tên người nhận không được để trống';
    }

    if (formData.gia_tri_hang_hoa_phi_van_chuyen <= 0) {
      newErrors.gia_tri_hang_hoa_phi_van_chuyen = 'Giá trị hàng hóa phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Convert string to number for numeric fields
      const submitData = {
        ...formData,
        gia_tri_hang_hoa_phi_van_chuyen: parseFloat(formData.gia_tri_hang_hoa_phi_van_chuyen)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Get available next statuses (for edit mode)
   */
  const getAvailableStatuses = () => {
    if (!isEditMode) {
      return ['Đang xử lý']; // Only default status for new order
    }
    
    const currentStatus = order.Trang_thai_don;
    const nextStatuses = STATUS_WORKFLOW[currentStatus] || [];
    
    // Include current status + next possible statuses
    return [currentStatus, ...nextStatuses];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>
            {isEditMode ? '✏️ Cập nhật đơn hàng' : '➕ Tạo đơn hàng mới'}
          </h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-grid">
            {/* Column 1: Customer & Addresses */}
            <div className="form-section">
              <h3>📍 Thông tin đơn hàng</h3>

              {/* Customer ID */}
              <div className="form-group">
                <label htmlFor="Ma_khach_hang">
                  Mã khách hàng <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="Ma_khach_hang"
                  name="Ma_khach_hang"
                  value={formData.Ma_khach_hang}
                  onChange={handleChange}
                  placeholder="KH001"
                  disabled={isEditMode} // Can't change customer in edit mode
                  className={errors.Ma_khach_hang ? 'input-error' : ''}
                />
                {errors.Ma_khach_hang && (
                  <span className="error-message">{errors.Ma_khach_hang}</span>
                )}
              </div>

              {/* Pickup Address */}
              <div className="form-group">
                <label htmlFor="dia_chi_lay_hang">
                  Địa chỉ lấy hàng <span className="required">*</span>
                </label>
                <textarea
                  id="dia_chi_lay_hang"
                  name="dia_chi_lay_hang"
                  value={formData.dia_chi_lay_hang}
                  onChange={handleChange}
                  placeholder="123 Nguyễn Văn Cừ, Q5, TP.HCM"
                  rows="2"
                  disabled={isEditMode}
                  className={errors.dia_chi_lay_hang ? 'input-error' : ''}
                />
                {errors.dia_chi_lay_hang && (
                  <span className="error-message">{errors.dia_chi_lay_hang}</span>
                )}
              </div>

              {/* Delivery Address */}
              <div className="form-group">
                <label htmlFor="dia_chi_giao_hang">
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <textarea
                  id="dia_chi_giao_hang"
                  name="dia_chi_giao_hang"
                  value={formData.dia_chi_giao_hang}
                  onChange={handleChange}
                  placeholder="456 Lê Lợi, Q1, TP.HCM"
                  rows="2"
                  disabled={isEditMode}
                  className={errors.dia_chi_giao_hang ? 'input-error' : ''}
                />
                {errors.dia_chi_giao_hang && (
                  <span className="error-message">{errors.dia_chi_giao_hang}</span>
                )}
              </div>
            </div>

            {/* Column 2: Sender & Receiver Info */}
            <div className="form-section">
              <h3>👥 Người gửi & nhận</h3>

              {/* Sender Phone */}
              <div className="form-group">
                <label htmlFor="SDT_nguoi_gui">
                  SĐT người gửi <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="SDT_nguoi_gui"
                  name="SDT_nguoi_gui"
                  value={formData.SDT_nguoi_gui}
                  onChange={handleChange}
                  placeholder="0901234567"
                  maxLength="10"
                  disabled={isEditMode}
                  className={errors.SDT_nguoi_gui ? 'input-error' : ''}
                />
                {errors.SDT_nguoi_gui && (
                  <span className="error-message">{errors.SDT_nguoi_gui}</span>
                )}
              </div>

              {/* Sender Name */}
              <div className="form-group">
                <label htmlFor="ten_nguoi_gui">
                  Tên người gửi <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ten_nguoi_gui"
                  name="ten_nguoi_gui"
                  value={formData.ten_nguoi_gui}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  disabled={isEditMode}
                  className={errors.ten_nguoi_gui ? 'input-error' : ''}
                />
                {errors.ten_nguoi_gui && (
                  <span className="error-message">{errors.ten_nguoi_gui}</span>
                )}
              </div>

              {/* Receiver Phone */}
              <div className="form-group">
                <label htmlFor="SDT_nguoi_nhan">
                  SĐT người nhận <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="SDT_nguoi_nhan"
                  name="SDT_nguoi_nhan"
                  value={formData.SDT_nguoi_nhan}
                  onChange={handleChange}
                  placeholder="0907654321"
                  maxLength="10"
                  className={errors.SDT_nguoi_nhan ? 'input-error' : ''}
                />
                {errors.SDT_nguoi_nhan && (
                  <span className="error-message">{errors.SDT_nguoi_nhan}</span>
                )}
              </div>

              {/* Receiver Name */}
              <div className="form-group">
                <label htmlFor="ten_nguoi_nhan">
                  Tên người nhận <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ten_nguoi_nhan"
                  name="ten_nguoi_nhan"
                  value={formData.ten_nguoi_nhan}
                  onChange={handleChange}
                  placeholder="Trần Thị B"
                  className={errors.ten_nguoi_nhan ? 'input-error' : ''}
                />
                {errors.ten_nguoi_nhan && (
                  <span className="error-message">{errors.ten_nguoi_nhan}</span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Row */}
          <div className="form-row">
            {/* Package Value */}
            <div className="form-group">
              <label htmlFor="gia_tri_hang_hoa_phi_van_chuyen">
                Giá trị hàng hóa (VNĐ) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="gia_tri_hang_hoa_phi_van_chuyen"
                name="gia_tri_hang_hoa_phi_van_chuyen"
                value={formData.gia_tri_hang_hoa_phi_van_chuyen}
                onChange={handleChange}
                min="0"
                step="1000"
                disabled={isEditMode}
                className={errors.gia_tri_hang_hoa_phi_van_chuyen ? 'input-error' : ''}
              />
              {errors.gia_tri_hang_hoa_phi_van_chuyen && (
                <span className="error-message">{errors.gia_tri_hang_hoa_phi_van_chuyen}</span>
              )}
              <small className="help-text">
                Backend sẽ tự động tính phí vận chuyển dựa trên quãng đường
              </small>
            </div>

            {/* Status (Edit mode only) */}
            {isEditMode && (
              <div className="form-group">
                <label htmlFor="Trang_thai_don">
                  Trạng thái <span className="required">*</span>
                </label>
                <select
                  id="Trang_thai_don"
                  name="Trang_thai_don"
                  value={formData.Trang_thai_don}
                  onChange={handleChange}
                >
                  {getAvailableStatuses().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <small className="help-text">
                  Chỉ có thể chuyển sang trạng thái hợp lệ tiếp theo
                </small>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="ghi_chu">Ghi chú</label>
            <textarea
              id="ghi_chu"
              name="ghi_chu"
              value={formData.ghi_chu}
              onChange={handleChange}
              placeholder="Giao hàng trong giờ hành chính, cẩn thận hàng dễ vỡ..."
              rows="3"
            />
          </div>

          {/* Info Box for New Order */}
          {!isEditMode && (
            <div className="info-box">
              <strong>ℹ️ Lưu ý:</strong>
              <ul>
                <li>Backend sẽ tự động tính <strong>quãng đường</strong> (km)</li>
                <li>Phí vận chuyển = quãng đường × 15,000 VNĐ/km</li>
                <li>Mã đơn hàng sẽ được tạo tự động (DHxxxx)</li>
                <li>Trạng thái mặc định: "Đang xử lý"</li>
              </ul>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo đơn hàng')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
```

**File: `src/components/order/OrderForm.css`**

```css
.order-form-modal {
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.order-form {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.order-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.order-form textarea:focus {
  outline: none;
  border-color: #667eea;
}

.order-form textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.info-box {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

.info-box strong {
  display: block;
  margin-bottom: 8px;
  color: #0c5460;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
  color: #0c5460;
}

.info-box li {
  margin-bottom: 5px;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid,
  .form-row {
    grid-template-columns: 1fr;
  }

  .order-form-modal {
    max-width: 95%;
  }
}
```

---

## 📄 Bước 3.7: Tạo Pagination Component

**File: `src/components/common/Pagination.jsx`**

```javascript
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, total, onPageChange }) => {
  /**
   * Generate page numbers to display
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Trang {currentPage} / {totalPages} (Tổng {total} bản ghi)
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className="pagination-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          ← Trước
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination-btn ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'dots' : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
```

**File: `src/components/common/Pagination.css`**

```css
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-btn {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  min-width: 40px;
}

.pagination-btn:hover:not(:disabled):not(.dots) {
  background-color: #f0f0f0;
  border-color: #667eea;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.dots {
  border: none;
  cursor: default;
}

.pagination-btn.dots:hover {
  background: white;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-info {
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
}
```

---

## 🎨 Bước 3.8: CSS cho Orders Page

**File: `src/pages/OrdersPage.css`**

```css
.orders-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Order Details Modal */
.order-details-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

.order-details-modal .modal-body {
  padding: 20px;
}

.order-details-modal pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

/* Reuse styles from DriversPage */
.orders-page .page-header,
.orders-page .btn-primary,
.orders-page .loading-container,
.orders-page .error-container,
.orders-page .no-results {
  /* Same as DriversPage.css */
}
```

---

## 🔗 Bước 3.9: Update Routes & Dashboard

**File: `src/App.jsx` (Update Routes)**

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DriversPage from './pages/DriversPage';
import OrdersPage from './pages/OrdersPage'; // NEW

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/drivers" 
            element={
              <ProtectedRoute>
                <DriversPage />
              </ProtectedRoute>
            } 
          />

          {/* NEW: Orders Page */}
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

**File: `src/pages/DashboardPage.jsx` (Update Card 1)**

```javascript
// Update Card 1 with link to orders
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
```

---

## ✅ Bước 3.10: Test Order Management

### Test Checklist:

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Test Cases:**

1. **View Orders List:**
   - [ ] Click "Đơn hàng" card từ dashboard
   - [ ] Verify table hiển thị với 11 status colors
   - [ ] Check pagination hiển thị đúng

2. **Filter Orders:**
   - [ ] Select status "Đang giao hàng"
   - [ ] Verify chỉ hiển thị orders với status đó
   - [ ] Try filter by customer ID (KH001)
   - [ ] Change sort order (ASC/DESC)
   - [ ] Click Reset → verify về default

3. **Create New Order:**
   - [ ] Click "➕ Tạo đơn hàng mới"
   - [ ] Fill form:
     ```
     Ma_khach_hang: KH001
     dia_chi_lay_hang: 123 Test Street
     dia_chi_giao_hang: 456 Test Avenue
     SDT_nguoi_gui: 0901234567
     ten_nguoi_gui: Test Sender
     SDT_nguoi_nhan: 0907654321
     ten_nguoi_nhan: Test Receiver
     gia_tri_hang_hoa: 500000
     ghi_chu: Test order
     ```
   - [ ] Click "Tạo đơn hàng"
   - [ ] Verify alert thành công
   - [ ] Verify order mới xuất hiện với:
     * Ma_don_hang auto-generated (DHxxxx)
     * quang_duong calculated
     * phi_van_chuyen_goc calculated
     * Trang_thai_don = "Đang xử lý"

4. **Validation Test:**
   - [ ] Try submit với Ma_khach_hang sai format
   - [ ] Try submit với SĐT không đủ 10 số
   - [ ] Try submit với gia_tri_hang_hoa = 0
   - [ ] Verify validation errors hiển thị

5. **Edit Order Status:**
   - [ ] Click ✏️ button trên 1 order
   - [ ] Verify form mở với data pre-filled
   - [ ] Change "Trang_thai_don" → next valid status
   - [ ] Verify dropdown chỉ hiển thị valid statuses
   - [ ] Click "Cập nhật"
   - [ ] Verify status updated trong table

6. **View Order Details:**
   - [ ] Click 👁️ button
   - [ ] Verify modal hiển thị full order data
   - [ ] Check khachHang info included

7. **Delete Order:**
   - [ ] Click 🗑️ button
   - [ ] Verify confirm dialog
   - [ ] Click "Xác nhận"
   - [ ] Verify order deleted

8. **Pagination:**
   - [ ] Create > 10 orders để test pagination
   - [ ] Click page 2
   - [ ] Verify URL updated
   - [ ] Verify correct orders displayed
   - [ ] Test "Trước" và "Sau" buttons

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 3

✅ **Đã hoàn thành:**
- Order API services với params đầy đủ
- Constants file (11 statuses, workflow, formatters)
- OrdersPage với filter/sort/pagination
- OrderFilter component với 4 filters
- OrderTable với color-coded status badges
- OrderForm với validation & auto-calculate info
- Pagination component
- Routes & Dashboard updates

✅ **Features hoạt động:**
- **11 Order Statuses** với workflow validation
- **Auto Shipping Calculation** (backend tính tự động)
- **Advanced Filtering** (status, customer, sort)
- **Pagination** với page numbers
- **Create Order** với validation đầy đủ
- **Update Status** (chỉ cho phép next valid statuses)
- **View Details** với full order info
- **Delete** với confirmation
- **Color-coded badges** cho mỗi status
- **Price display** với original/discount/final

✅ **Responsive UI:**
- Form 2 columns → 1 column trên mobile
- Table scrollable trên mobile
- Pagination wrap trên mobile

---

## 💡 ADVANCED FEATURES IMPLEMENTED

1. **Status Workflow Validation:**
   ```javascript
   const STATUS_WORKFLOW = {
     'Đang xử lý': ['Đang tìm tài xế'],
     'Đang tìm tài xế': ['Đã tìm được tài xế', 'Đang xử lý'],
     // ... 11 statuses total
   }
   ```

2. **Auto Calculation (Backend):**
   - quang_duong: Based on addresses
   - phi_van_chuyen_goc: quang_duong × 15,000 VNĐ
   - phi_van_chuyen_sau_giam: After discount
   - Ma_don_hang: Auto-increment DHxxxx

3. **Smart Pagination:**
   - Shows ... for large page counts
   - Always shows first & last page
   - Shows pages around current page

4. **Multi-criteria Filtering:**
   - Filter by status
   - Filter by customer
   - Sort by 5 different fields
   - ASC/DESC order

---

## ⏭️ TIẾP THEO

**GIAI ĐOẠN 4: DELIVERY TRIP MANAGEMENT** 🚚  
Implement tính năng mới:
- Tạo chuyến giao hàng
- Gộp nhiều đơn vào 1 chuyến
- Tính tổng quãng đường
- Quản lý thứ tự lấy/giao hàng
- Update trạng thái chuyến

---

# GIAI ĐOẠN 4: DELIVERY TRIP MANAGEMENT

**Mục tiêu:** Implement quản lý chuyến giao hàng

**Tính năng:**
- ✅ Tạo chuyến giao hàng mới
- ✅ Thêm nhiều đơn hàng vào 1 chuyến
- ✅ Tự động tính tổng quãng đường
- ✅ Quản lý thứ tự lấy/giao hàng
- ✅ Update trạng thái chuyến (Đang thực hiện → Hoàn thành → Đã hủy)
- ✅ View chi tiết chuyến với danh sách đơn hàng

**Backend Endpoints (6 endpoints):**
```
POST   /api/delivery-trips          - Create trip
GET    /api/delivery-trips          - Get all trips
GET    /api/delivery-trips/:id      - Get trip details
POST   /api/delivery-trips/:id/orders - Add order to trip
PUT    /api/delivery-trips/:id      - Update trip status
DELETE /api/delivery-trips/:id      - Delete trip
```

---

## 📝 Bước 4.1: Delivery Trip API Services

**File: `src/services/deliveryTripAPI.js`**

```javascript
import api from './api';

const deliveryTripAPI = {
  /**
   * Get all delivery trips
   * @param {Object} params - { page, limit, status, ma_tai_xe, sortBy, sortOrder }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/delivery-trips', { params });
      return response.data;
    } catch (error) {
      console.error('Get delivery trips error:', error);
      throw error;
    }
  },

  /**
   * Get delivery trip by ID
   * @param {string} id - Ma_chuyen_giao_hang
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/delivery-trips/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get delivery trip error:', error);
      throw error;
    }
  },

  /**
   * Create new delivery trip
   * @param {Object} tripData - { ma_tai_xe, ngay_bat_dau }
   */
  create: async (tripData) => {
    try {
      const response = await api.post('/delivery-trips', tripData);
      return response.data;
    } catch (error) {
      console.error('Create delivery trip error:', error);
      throw error;
    }
  },

  /**
   * Add order to delivery trip
   * @param {string} tripId - Ma_chuyen_giao_hang
   * @param {Object} orderData - { ma_don_hang, thu_tu_lay_hang, thu_tu_giao_hang }
   */
  addOrder: async (tripId, orderData) => {
    try {
      const response = await api.post(`/delivery-trips/${tripId}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Add order to trip error:', error);
      throw error;
    }
  },

  /**
   * Update delivery trip status
   * @param {string} id - Ma_chuyen_giao_hang
   * @param {Object} updateData - { trang_thai, ngay_ket_thuc }
   */
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/delivery-trips/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update delivery trip error:', error);
      throw error;
    }
  },

  /**
   * Delete delivery trip
   * @param {string} id - Ma_chuyen_giao_hang
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/delivery-trips/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete delivery trip error:', error);
      throw error;
    }
  }
};

export default deliveryTripAPI;
```

---

## 📦 Bước 4.2: Trip Constants

**File: `src/utils/tripConstants.js`**

```javascript
/**
 * Delivery Trip Statuses
 */
export const TRIP_STATUSES = [
  { value: 'Đang thực hiện', label: 'Đang thực hiện', icon: '🚚' },
  { value: 'Hoàn thành', label: 'Hoàn thành', icon: '✅' },
  { value: 'Đã hủy', label: 'Đã hủy', icon: '❌' }
];

/**
 * Trip Status Colors for badges
 */
export const TRIP_STATUS_COLORS = {
  'Đang thực hiện': '#3498db',  // Blue
  'Hoàn thành': '#27ae60',      // Green
  'Đã hủy': '#95a5a6'           // Gray
};

/**
 * Trip Status Workflow (Valid transitions)
 */
export const TRIP_STATUS_WORKFLOW = {
  'Đang thực hiện': ['Hoàn thành', 'Đã hủy'],
  'Hoàn thành': [],  // Can't change from completed
  'Đã hủy': []       // Can't change from cancelled
};

/**
 * Sort fields for delivery trips
 */
export const TRIP_SORT_FIELDS = [
  { value: 'Ma_chuyen_giao_hang', label: 'Mã chuyến' },
  { value: 'ngay_bat_dau', label: 'Ngày bắt đầu' },
  { value: 'ngay_ket_thuc', label: 'Ngày kết thúc' },
  { value: 'tong_quang_duong', label: 'Tổng quãng đường' }
];

/**
 * Format datetime for display
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate trip duration in hours
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return diffHours;
};
```

---

## 📄 Bước 4.3: Delivery Trips Page (Main Component)

**File: `src/pages/DeliveryTripsPage.jsx`**

```javascript
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import deliveryTripAPI from '../services/deliveryTripAPI';
import TripFilter from '../components/trip/TripFilter';
import TripTable from '../components/trip/TripTable';
import TripForm from '../components/trip/TripForm';
import AddOrderToTripForm from '../components/trip/AddOrderToTripForm';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './DeliveryTripsPage.css';

const DeliveryTripsPage = () => {
  // State
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    ma_tai_xe: '',
    sortBy: 'ngay_bat_dau',
    sortOrder: 'DESC'
  });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // URL params
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetch delivery trips
   */
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const data = await deliveryTripAPI.getAll(params);

      setTrips(data.trips);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách chuyến giao hàng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount và khi params thay đổi
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  useEffect(() => {
    fetchTrips();
  }, [pagination.page, filters]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({ page: '1' });
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    setSearchParams({ page: page.toString() });
  };

  /**
   * Handle create trip
   */
  const handleCreateTrip = async (tripData) => {
    try {
      await deliveryTripAPI.create(tripData);
      alert('✅ Tạo chuyến giao hàng thành công!');
      setShowCreateModal(false);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể tạo chuyến'));
    }
  };

  /**
   * Handle view trip details
   */
  const handleViewDetails = async (trip) => {
    try {
      const data = await deliveryTripAPI.getById(trip.Ma_chuyen_giao_hang);
      setSelectedTrip(data.trip);
      setShowDetailsModal(true);
    } catch (err) {
      alert('❌ Không thể tải chi tiết chuyến: ' + err.response?.data?.message);
    }
  };

  /**
   * Handle add order to trip
   */
  const handleAddOrder = (trip) => {
    setSelectedTrip(trip);
    setShowAddOrderModal(true);
  };

  /**
   * Handle add order submit
   */
  const handleAddOrderSubmit = async (orderData) => {
    try {
      await deliveryTripAPI.addOrder(selectedTrip.Ma_chuyen_giao_hang, orderData);
      alert('✅ Thêm đơn hàng vào chuyến thành công!');
      setShowAddOrderModal(false);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể thêm đơn hàng'));
    }
  };

  /**
   * Handle update trip status
   */
  const handleUpdateStatus = async (trip, newStatus) => {
    try {
      const updateData = {
        trang_thai: newStatus
      };

      // If completing the trip, add end date
      if (newStatus === 'Hoàn thành') {
        updateData.ngay_ket_thuc = new Date().toISOString();
      }

      await deliveryTripAPI.update(trip.Ma_chuyen_giao_hang, updateData);
      alert('✅ Cập nhật trạng thái thành công!');
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể cập nhật'));
    }
  };

  /**
   * Handle delete trip
   */
  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deliveryTripAPI.delete(tripToDelete.Ma_chuyen_giao_hang);
      alert('✅ Xóa chuyến giao hàng thành công!');
      setShowDeleteDialog(false);
      setTripToDelete(null);
      fetchTrips();
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa chuyến'));
    }
  };

  return (
    <div className="delivery-trips-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>🚚 Quản lý Chuyến giao hàng</h1>
          <p>Tạo chuyến, thêm đơn hàng, theo dõi tiến trình giao hàng</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          ➕ Tạo chuyến mới
        </button>
      </div>

      {/* Filter */}
      <TripFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={fetchTrips}>Thử lại</button>
        </div>
      )}

      {/* Trips Table */}
      {!loading && !error && (
        <>
          {trips.length > 0 ? (
            <>
              <TripTable
                trips={trips}
                onViewDetails={handleViewDetails}
                onAddOrder={handleAddOrder}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteClick}
              />

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="no-results">
              <p>📭 Không tìm thấy chuyến giao hàng nào</p>
              <button onClick={() => setShowCreateModal(true)}>
                Tạo chuyến đầu tiên
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Trip Modal */}
      {showCreateModal && (
        <TripForm
          onSubmit={handleCreateTrip}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Trip Details Modal */}
      {showDetailsModal && selectedTrip && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content trip-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Chi tiết chuyến: {selectedTrip.Ma_chuyen_giao_hang}</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(selectedTrip, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Add Order to Trip Modal */}
      {showAddOrderModal && selectedTrip && (
        <AddOrderToTripForm
          trip={selectedTrip}
          onSubmit={handleAddOrderSubmit}
          onClose={() => setShowAddOrderModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && tripToDelete && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa chuyến "${tripToDelete.Ma_chuyen_giao_hang}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setTripToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryTripsPage;
```

---

## 🔍 Bước 4.4: Trip Filter Component

**File: `src/components/trip/TripFilter.jsx`**

```javascript
import { useState, useEffect } from 'react';
import { TRIP_STATUSES, TRIP_SORT_FIELDS } from '../../utils/tripConstants';
import './TripFilter.css';

const TripFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      status: '',
      ma_tai_xe: '',
      sortBy: 'ngay_bat_dau',
      sortOrder: 'DESC'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="trip-filter-container">
      <div className="filter-grid">
        {/* Status Filter */}
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tất cả</option>
            {TRIP_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Filter */}
        <div className="filter-group">
          <label>Mã tài xế:</label>
          <input
            type="text"
            value={localFilters.ma_tai_xe}
            onChange={(e) => handleChange('ma_tai_xe', e.target.value)}
            placeholder="TX001"
          />
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label>Sắp xếp theo:</label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            {TRIP_SORT_FIELDS.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label>Thứ tự:</label>
          <select
            value={localFilters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          >
            <option value="ASC">Tăng dần ↑</option>
            <option value="DESC">Giảm dần ↓</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="filter-actions">
        <button className="btn-apply" onClick={handleApply}>
          🔍 Áp dụng
        </button>
        <button className="btn-reset" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default TripFilter;
```

**File: `src/components/trip/TripFilter.css`**

```css
.trip-filter-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

/* Reuse styles from OrderFilter.css */
.filter-group,
.filter-actions,
.btn-apply,
.btn-reset {
  /* Same as OrderFilter.css */
}
```

---

## 📊 Bước 4.5: Trip Table Component

**File: `src/components/trip/TripTable.jsx`**

```javascript
import { TRIP_STATUS_COLORS, TRIP_STATUS_WORKFLOW, formatDateTime, calculateDuration } from '../../utils/tripConstants';
import { formatCurrency, formatDistance } from '../../utils/constants';
import './TripTable.css';

const TripTable = ({ trips, onViewDetails, onAddOrder, onUpdateStatus, onDelete }) => {
  /**
   * Get available next statuses for a trip
   */
  const getNextStatuses = (currentStatus) => {
    return TRIP_STATUS_WORKFLOW[currentStatus] || [];
  };

  return (
    <div className="trip-table-container">
      <table className="trip-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tài xế</th>
            <th>Trạng thái</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Thời gian (giờ)</th>
            <th>Tổng quãng đường</th>
            <th>Số đơn hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => {
            const duration = calculateDuration(trip.ngay_bat_dau, trip.ngay_ket_thuc);
            const nextStatuses = getNextStatuses(trip.trang_thai);

            return (
              <tr key={trip.Ma_chuyen_giao_hang}>
                {/* Trip ID */}
                <td className="trip-id">{trip.Ma_chuyen_giao_hang}</td>

                {/* Driver */}
                <td>{trip.ma_tai_xe}</td>

                {/* Status Badge */}
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: TRIP_STATUS_COLORS[trip.trang_thai] }}
                  >
                    {trip.trang_thai}
                  </span>
                </td>

                {/* Start Date */}
                <td>{formatDateTime(trip.ngay_bat_dau)}</td>

                {/* End Date */}
                <td>{trip.ngay_ket_thuc ? formatDateTime(trip.ngay_ket_thuc) : '—'}</td>

                {/* Duration */}
                <td>{duration !== null ? `${duration}h` : '—'}</td>

                {/* Total Distance */}
                <td>{formatDistance(trip.tong_quang_duong)}</td>

                {/* Order Count */}
                <td className="order-count">
                  <strong>{trip.orderCount || 0}</strong> đơn
                </td>

                {/* Actions */}
                <td className="action-buttons">
                  {/* View Details */}
                  <button
                    className="btn-icon btn-view"
                    onClick={() => onViewDetails(trip)}
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>

                  {/* Add Order (only if Đang thực hiện) */}
                  {trip.trang_thai === 'Đang thực hiện' && (
                    <button
                      className="btn-icon btn-add"
                      onClick={() => onAddOrder(trip)}
                      title="Thêm đơn hàng"
                    >
                      ➕
                    </button>
                  )}

                  {/* Update Status Dropdown */}
                  {nextStatuses.length > 0 && (
                    <select
                      className="status-select"
                      onChange={(e) => onUpdateStatus(trip, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Cập nhật trạng thái</option>
                      {nextStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  )}

                  {/* Delete */}
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(trip)}
                    title="Xóa chuyến"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TripTable;
```

**File: `src/components/trip/TripTable.css`**

```css
.trip-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.trip-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.trip-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.trip-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.trip-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.trip-table tbody tr:hover {
  background-color: #f8f9fa;
}

.trip-table td {
  padding: 12px 15px;
  font-size: 13px;
}

.trip-id {
  font-weight: 700;
  color: #667eea;
  font-family: monospace;
}

.order-count {
  text-align: center;
  font-size: 14px;
}

.status-select {
  padding: 5px 8px;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;
}

.status-select:hover {
  background-color: #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-add {
  background-color: #27ae60;
}

.btn-add:hover {
  background-color: #229954;
}

/* Responsive */
@media (max-width: 768px) {
  .trip-table-container {
    overflow-x: scroll;
  }
}
```

---

## 📝 Bước 4.6: Trip Form Component (Create Trip)

**File: `src/components/trip/TripForm.jsx`**

```javascript
import { useState } from 'react';
import './TripForm.css';

const TripForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_tai_xe: '',
    ngay_bat_dau: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.ma_tai_xe.trim()) {
      newErrors.ma_tai_xe = 'Mã tài xế không được để trống';
    } else if (!/^TX\d{3}$/.test(formData.ma_tai_xe)) {
      newErrors.ma_tai_xe = 'Mã tài xế phải có định dạng TXxxx (ví dụ: TX001)';
    }

    if (!formData.ngay_bat_dau) {
      newErrors.ngay_bat_dau = 'Ngày bắt đầu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content trip-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚚 Tạo chuyến giao hàng mới</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          {/* Driver ID */}
          <div className="form-group">
            <label htmlFor="ma_tai_xe">
              Mã tài xế <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ma_tai_xe"
              name="ma_tai_xe"
              value={formData.ma_tai_xe}
              onChange={handleChange}
              placeholder="TX001"
              className={errors.ma_tai_xe ? 'input-error' : ''}
            />
            {errors.ma_tai_xe && (
              <span className="error-message">{errors.ma_tai_xe}</span>
            )}
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="ngay_bat_dau">
              Ngày bắt đầu <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="ngay_bat_dau"
              name="ngay_bat_dau"
              value={formData.ngay_bat_dau}
              onChange={handleChange}
              className={errors.ngay_bat_dau ? 'input-error' : ''}
            />
            {errors.ngay_bat_dau && (
              <span className="error-message">{errors.ngay_bat_dau}</span>
            )}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <strong>ℹ️ Lưu ý:</strong>
            <ul>
              <li>Mã chuyến sẽ được tạo tự động (CGxxxx)</li>
              <li>Trạng thái mặc định: "Đang thực hiện"</li>
              <li>Sau khi tạo, bạn có thể thêm đơn hàng vào chuyến</li>
              <li>Tổng quãng đường sẽ được tính tự động khi thêm đơn</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang tạo...' : 'Tạo chuyến'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
```

**File: `src/components/trip/TripForm.css`**

```css
.trip-form-modal {
  max-width: 500px;
}

.trip-form {
  padding: 20px;
}

.trip-form .form-group {
  margin-bottom: 20px;
}

/* Reuse common form styles */
.trip-form input[type="datetime-local"] {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.trip-form input[type="datetime-local"]:focus {
  outline: none;
  border-color: #667eea;
}
```

---

## ➕ Bước 4.7: Add Order to Trip Form

**File: `src/components/trip/AddOrderToTripForm.jsx`**

```javascript
import { useState } from 'react';
import './AddOrderToTripForm.css';

const AddOrderToTripForm = ({ trip, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_don_hang: '',
    thu_tu_lay_hang: 1,
    thu_tu_giao_hang: 1
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.ma_don_hang.trim()) {
      newErrors.ma_don_hang = 'Mã đơn hàng không được để trống';
    } else if (!/^DH\d{4}$/.test(formData.ma_don_hang)) {
      newErrors.ma_don_hang = 'Mã đơn hàng phải có định dạng DHxxxx (ví dụ: DH0001)';
    }

    if (formData.thu_tu_lay_hang < 1) {
      newErrors.thu_tu_lay_hang = 'Thứ tự lấy hàng phải >= 1';
    }

    if (formData.thu_tu_giao_hang < 1) {
      newErrors.thu_tu_giao_hang = 'Thứ tự giao hàng phải >= 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const submitData = {
        ma_don_hang: formData.ma_don_hang,
        thu_tu_lay_hang: parseInt(formData.thu_tu_lay_hang),
        thu_tu_giao_hang: parseInt(formData.thu_tu_giao_hang)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-order-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Thêm đơn hàng vào chuyến</h2>
          <button className="btn-close" onClick={onClose}>✖️</button>
        </div>

        <form onSubmit={handleSubmit} className="add-order-form">
          {/* Trip Info */}
          <div className="trip-info-box">
            <p><strong>Chuyến:</strong> {trip.Ma_chuyen_giao_hang}</p>
            <p><strong>Tài xế:</strong> {trip.ma_tai_xe}</p>
            <p><strong>Số đơn hiện tại:</strong> {trip.orderCount || 0} đơn</p>
          </div>

          {/* Order ID */}
          <div className="form-group">
            <label htmlFor="ma_don_hang">
              Mã đơn hàng <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ma_don_hang"
              name="ma_don_hang"
              value={formData.ma_don_hang}
              onChange={handleChange}
              placeholder="DH0001"
              className={errors.ma_don_hang ? 'input-error' : ''}
            />
            {errors.ma_don_hang && (
              <span className="error-message">{errors.ma_don_hang}</span>
            )}
          </div>

          {/* Pickup Order */}
          <div className="form-group">
            <label htmlFor="thu_tu_lay_hang">
              Thứ tự lấy hàng <span className="required">*</span>
            </label>
            <input
              type="number"
              id="thu_tu_lay_hang"
              name="thu_tu_lay_hang"
              value={formData.thu_tu_lay_hang}
              onChange={handleChange}
              min="1"
              className={errors.thu_tu_lay_hang ? 'input-error' : ''}
            />
            {errors.thu_tu_lay_hang && (
              <span className="error-message">{errors.thu_tu_lay_hang}</span>
            )}
            <small className="help-text">
              Thứ tự tài xế sẽ lấy hàng (1, 2, 3,...)
            </small>
          </div>

          {/* Delivery Order */}
          <div className="form-group">
            <label htmlFor="thu_tu_giao_hang">
              Thứ tự giao hàng <span className="required">*</span>
            </label>
            <input
              type="number"
              id="thu_tu_giao_hang"
              name="thu_tu_giao_hang"
              value={formData.thu_tu_giao_hang}
              onChange={handleChange}
              min="1"
              className={errors.thu_tu_giao_hang ? 'input-error' : ''}
            />
            {errors.thu_tu_giao_hang && (
              <span className="error-message">{errors.thu_tu_giao_hang}</span>
            )}
            <small className="help-text">
              Thứ tự tài xế sẽ giao hàng (1, 2, 3,...)
            </small>
          </div>

          {/* Info */}
          <div className="info-box">
            <strong>ℹ️ Lưu ý:</strong>
            <ul>
              <li>Đơn hàng phải có trạng thái "Đã tìm được tài xế"</li>
              <li>Backend sẽ tự động cập nhật tổng quãng đường của chuyến</li>
              <li>Thứ tự có thể trùng nhau (tùy thuộc lộ trình)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang thêm...' : 'Thêm đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderToTripForm;
```

**File: `src/components/trip/AddOrderToTripForm.css`**

```css
.add-order-form-modal {
  max-width: 500px;
}

.add-order-form {
  padding: 20px;
}

.trip-info-box {
  background-color: #e8f4f8;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

.trip-info-box p {
  margin: 5px 0;
  font-size: 14px;
  color: #0c5460;
}

.add-order-form .form-group {
  margin-bottom: 20px;
}
```

---

## 🎨 Bước 4.8: CSS cho Delivery Trips Page

**File: `src/pages/DeliveryTripsPage.css`**

```css
.delivery-trips-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.trip-details-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.trip-details-modal .modal-body {
  padding: 20px;
}

.trip-details-modal pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

/* Reuse common page styles */
.delivery-trips-page .page-header,
.delivery-trips-page .btn-primary,
.delivery-trips-page .loading-container,
.delivery-trips-page .error-container,
.delivery-trips-page .no-results {
  /* Same as DriversPage.css & OrdersPage.css */
}
```

---

## 🔗 Bước 4.9: Update Routes & Dashboard

**Update `src/App.jsx`:**

```javascript
import DeliveryTripsPage from './pages/DeliveryTripsPage'; // NEW

// Add route
<Route 
  path="/delivery-trips" 
  element={
    <ProtectedRoute>
      <DeliveryTripsPage />
    </ProtectedRoute>
  } 
/>
```

**Update `src/pages/DashboardPage.jsx` (Card 3):**

```javascript
<div 
  onClick={() => navigate('/delivery-trips')}
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
```

---

## ✅ Bước 4.10: Test Delivery Trip Management

### Test Checklist:

1. **View Trips List:**
   - [ ] Navigate to /delivery-trips
   - [ ] Verify table displays với 3 status colors
   - [ ] Check pagination works

2. **Create New Trip:**
   - [ ] Click "Tạo chuyến mới"
   - [ ] Fill form:
     ```
     ma_tai_xe: TX001
     ngay_bat_dau: (current datetime)
     ```
   - [ ] Verify trip created với:
     * Ma_chuyen_giao_hang auto-generated (CGxxxx)
     * trang_thai = "Đang thực hiện"
     * tong_quang_duong = 0 (initially)

3. **Add Order to Trip:**
   - [ ] Click ➕ button on a "Đang thực hiện" trip
   - [ ] Fill form:
     ```
     ma_don_hang: DH0001
     thu_tu_lay_hang: 1
     thu_tu_giao_hang: 1
     ```
   - [ ] Verify order added successfully
   - [ ] Verify tong_quang_duong updated

4. **Filter Trips:**
   - [ ] Filter by status "Hoàn thành"
   - [ ] Filter by driver TX001
   - [ ] Change sort order
   - [ ] Click Reset

5. **Update Trip Status:**
   - [ ] Select "Hoàn thành" from dropdown
   - [ ] Verify status updated
   - [ ] Verify ngay_ket_thuc populated
   - [ ] Verify can't add more orders to completed trip

6. **View Trip Details:**
   - [ ] Click 👁️ button
   - [ ] Verify modal shows full trip data with orders

7. **Delete Trip:**
   - [ ] Click 🗑️ button
   - [ ] Confirm deletion
   - [ ] Verify trip deleted

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 4

✅ **Đã hoàn thành:**
- Delivery Trip API services (6 endpoints)
- Trip constants (3 statuses, workflow, formatters)
- DeliveryTripsPage với filter/pagination
- TripFilter component (4 filters)
- TripTable với status dropdown
- TripForm (create trip)
- AddOrderToTripForm (add order với thứ tự)
- Routes & Dashboard updates

✅ **NEW Features:**
- **3 Trip Statuses**: Đang thực hiện → Hoàn thành / Đã hủy
- **Auto Total Distance**: Tính tự động khi thêm đơn
- **Order Sequence**: thu_tu_lay_hang, thu_tu_giao_hang
- **Trip Details**: View với full order list
- **Workflow Validation**: Chỉ cho phép valid status transitions
- **Duration Calculation**: Tính giờ từ start → end

✅ **Integration với Orders:**
- Chỉ add được đơn hàng có status "Đã tìm được tài xế"
- Backend tự động update tổng quãng đường của chuyến
- View chi tiết chuyến shows all orders in trip

---

## ⏭️ TIẾP THEO

**GIAI ĐOẠN 5: REPORTS & ANALYTICS** 📊  
Implement báo cáo:
- Top drivers by rating
- Top customers by revenue  
- Charts & statistics

---

# GIAI ĐOẠN 5: REPORTS & ANALYTICS

**Mục tiêu:** Implement trang báo cáo và thống kê cho quản lý

**Tính năng:**
- ✅ Top tài xế theo rating
- ✅ Top khách hàng theo doanh thu
- ✅ Hiển thị thống kê với cards
- ✅ Filter theo time range và limit
- ✅ Responsive design

**Backend Endpoints (2 endpoints):**
```
GET /api/reports/top-drivers?limit=10
GET /api/reports/top-customers?limit=10
```

---

## 📝 Bước 5.1: Reports API Services

**File: `src/services/reportsAPI.js`**

```javascript
import api from './api';

const reportsAPI = {
  /**
   * Get top drivers by rating
   * @param {Object} params - { limit }
   */
  getTopDrivers: async (params = { limit: 10 }) => {
    try {
      const response = await api.get('/reports/top-drivers', { params });
      return response.data;
    } catch (error) {
      console.error('Get top drivers error:', error);
      throw error;
    }
  },

  /**
   * Get top customers by revenue
   * @param {Object} params - { limit }
   */
  getTopCustomers: async (params = { limit: 10 }) => {
    try {
      const response = await api.get('/reports/top-customers', { params });
      return response.data;
    } catch (error) {
      console.error('Get top customers error:', error);
      throw error;
    }
  }
};

export default reportsAPI;
```

---

## 📊 Bước 5.2: Reports Page (Main Component)

**File: `src/pages/ReportsPage.jsx`**

```javascript
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

      setTopDrivers(driversData.drivers);
      setTopCustomers(customersData.customers);
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
```

**File: `src/pages/ReportsPage.css`**

```css
.reports-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🏆 Bước 5.3: Top Drivers Card Component

**File: `src/components/reports/TopDriversCard.jsx`**

```javascript
import { formatCurrency } from '../../utils/constants';
import './TopDriversCard.css';

const TopDriversCard = ({ drivers, limit, onLimitChange }) => {
  /**
   * Get medal emoji for rank
   */
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  /**
   * Get rating stars
   */
  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars;
  };

  return (
    <div className="report-card top-drivers-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>🏆 Top Tài xế theo Rating</h2>
          <p>Tài xế xuất sắc nhất hệ thống</p>
        </div>
        
        {/* Limit Selector */}
        <div className="limit-selector">
          <label>Hiển thị:</label>
          <select value={limit} onChange={(e) => onLimitChange(parseInt(e.target.value))}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {drivers.length > 0 ? (
          <div className="drivers-list">
            {drivers.map((driver, index) => (
              <div key={driver.ma_tai_xe} className={`driver-item rank-${index + 1}`}>
                {/* Rank */}
                <div className="driver-rank">
                  <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                </div>

                {/* Driver Info */}
                <div className="driver-info">
                  <div className="driver-name">
                    <strong>{driver.ma_tai_xe}</strong>
                    <span className="vehicle-type">{driver.loai_xe}</span>
                  </div>
                  <div className="driver-stats">
                    <span className="rating">
                      {getRatingStars(driver.rating)} 
                      <strong>{driver.rating.toFixed(1)}</strong>
                    </span>
                    <span className="trips-count">
                      🚚 {driver.totalTrips} chuyến
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="driver-revenue">
                  <div className="revenue-label">Doanh thu</div>
                  <div className="revenue-value">
                    {formatCurrency(driver.totalRevenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>📭 Không có dữ liệu tài xế</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <p>💡 <em>Rating trung bình từ khách hàng đánh giá</em></p>
      </div>
    </div>
  );
};

export default TopDriversCard;
```

**File: `src/components/reports/TopDriversCard.css`**

```css
.report-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.header-title p {
  margin: 5px 0 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.limit-selector label {
  font-size: 14px;
  font-weight: 600;
}

.limit-selector select {
  padding: 8px 12px;
  border: 2px solid white;
  border-radius: 6px;
  background-color: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.limit-selector select:hover {
  background-color: #f0f0f0;
}

/* Card Body */
.card-body {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.drivers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.driver-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.driver-item:hover {
  background-color: #fff;
  border-color: #667eea;
  transform: translateX(5px);
}

/* Top 3 special styling */
.driver-item.rank-1 {
  background: linear-gradient(135deg, #fff9e6 0%, #ffe9b3 100%);
  border-color: #ffd700;
}

.driver-item.rank-2 {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-color: #c0c0c0;
}

.driver-item.rank-3 {
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0b3 100%);
  border-color: #cd7f32;
}

/* Rank Badge */
.driver-rank {
  flex-shrink: 0;
}

.rank-badge {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

/* Driver Info */
.driver-info {
  flex: 1;
  min-width: 0;
}

.driver-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.driver-name strong {
  font-size: 16px;
  color: #333;
  font-family: monospace;
}

.vehicle-type {
  padding: 4px 8px;
  background-color: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.driver-stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating strong {
  color: #333;
  font-size: 14px;
}

/* Revenue */
.driver-revenue {
  flex-shrink: 0;
  text-align: right;
}

.revenue-label {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.revenue-value {
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
}

/* Card Footer */
.card-footer {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.card-footer p {
  margin: 0;
  font-size: 13px;
  color: #666;
  text-align: center;
}

/* No Data */
.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .driver-item {
    flex-wrap: wrap;
  }

  .driver-revenue {
    width: 100%;
    text-align: left;
    margin-top: 10px;
  }
}
```

---

## 💰 Bước 5.4: Top Customers Card Component

**File: `src/components/reports/TopCustomersCard.jsx`**

```javascript
import { formatCurrency } from '../../utils/constants';
import './TopCustomersCard.css';

const TopCustomersCard = ({ customers, limit, onLimitChange }) => {
  /**
   * Get medal emoji for rank
   */
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  /**
   * Calculate average order value
   */
  const getAverageOrderValue = (customer) => {
    if (customer.totalOrders === 0) return 0;
    return customer.totalRevenue / customer.totalOrders;
  };

  return (
    <div className="report-card top-customers-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-title">
          <h2>💰 Top Khách hàng theo Doanh thu</h2>
          <p>Khách hàng có giá trị cao nhất</p>
        </div>
        
        {/* Limit Selector */}
        <div className="limit-selector">
          <label>Hiển thị:</label>
          <select value={limit} onChange={(e) => onLimitChange(parseInt(e.target.value))}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {customers.length > 0 ? (
          <div className="customers-list">
            {customers.map((customer, index) => (
              <div key={customer.Ma_khach_hang} className={`customer-item rank-${index + 1}`}>
                {/* Rank */}
                <div className="customer-rank">
                  <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                </div>

                {/* Customer Info */}
                <div className="customer-info">
                  <div className="customer-name">
                    <strong>{customer.Ma_khach_hang}</strong>
                    <span className="customer-fullname">{customer.Ten_khach_hang}</span>
                  </div>
                  <div className="customer-stats">
                    <span className="orders-count">
                      📦 {customer.totalOrders} đơn hàng
                    </span>
                    <span className="avg-order">
                      Trung bình: {formatCurrency(getAverageOrderValue(customer))}
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="customer-revenue">
                  <div className="revenue-label">Tổng doanh thu</div>
                  <div className="revenue-value">
                    {formatCurrency(customer.totalRevenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>📭 Không có dữ liệu khách hàng</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <p>💡 <em>Doanh thu tính từ tổng giá trị đơn hàng sau giảm giá</em></p>
      </div>
    </div>
  );
};

export default TopCustomersCard;
```

**File: `src/components/reports/TopCustomersCard.css`**

```css
/* Reuse most styles from TopDriversCard.css */
.top-customers-card .card-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.customers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.customer-item:hover {
  background-color: #fff;
  border-color: #f5576c;
  transform: translateX(5px);
}

/* Top 3 special styling */
.customer-item.rank-1 {
  background: linear-gradient(135deg, #fff9e6 0%, #ffe9b3 100%);
  border-color: #ffd700;
}

.customer-item.rank-2 {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-color: #c0c0c0;
}

.customer-item.rank-3 {
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0b3 100%);
  border-color: #cd7f32;
}

/* Customer Info */
.customer-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.customer-name strong {
  font-size: 16px;
  color: #333;
  font-family: monospace;
}

.customer-fullname {
  font-size: 13px;
  color: #666;
}

.customer-stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.avg-order {
  color: #27ae60;
  font-weight: 600;
}

/* Revenue */
.customer-revenue {
  flex-shrink: 0;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .customer-item {
    flex-wrap: wrap;
  }

  .customer-revenue {
    width: 100%;
    text-align: left;
    margin-top: 10px;
  }
}
```

---

## 🔗 Bước 5.5: Update Routes & Dashboard

**Update `src/App.jsx`:**

```javascript
import ReportsPage from './pages/ReportsPage'; // NEW

// Add route
<Route 
  path="/reports" 
  element={
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  } 
/>
```

**Update `src/pages/DashboardPage.jsx` (Card 4):**

```javascript
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
```

---

## ✅ Bước 5.6: Test Reports

### Test Checklist:

1. **View Reports Page:**
   - [ ] Navigate to /reports
   - [ ] Verify 2 cards hiển thị (Drivers & Customers)

2. **Top Drivers:**
   - [ ] Check top 3 có medal emojis (🥇🥈🥉)
   - [ ] Verify rating stars displayed
   - [ ] Check revenue formatting
   - [ ] Change limit to 20 → verify updates

3. **Top Customers:**
   - [ ] Check top 3 có special styling
   - [ ] Verify average order value calculated
   - [ ] Check total revenue displayed
   - [ ] Change limit to 5 → verify updates

4. **Responsive:**
   - [ ] Test trên mobile (cards stack vertically)
   - [ ] Test trên tablet

5. **Refresh:**
   - [ ] Click "Làm mới" → verify data reloaded

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 5

✅ **Đã hoàn thành:**
- Reports API services (2 endpoints)
- ReportsPage with grid layout
- TopDriversCard với ranking, rating stars, revenue
- TopCustomersCard với total revenue, avg order value
- Limit selector (Top 5/10/20/50)
- Responsive design
- Routes & Dashboard integration

✅ **Features:**
- **Top Drivers by Rating**: Medal badges, stars, trips count, revenue
- **Top Customers by Revenue**: Ranking, order count, average value
- **Dynamic Limits**: Filter hiển thị 5/10/20/50 records
- **Special Styling**: Top 3 có gradient backgrounds & borders
- **Smooth Animations**: Hover effects, transform
- **Auto Refresh**: Reload data on demand

---
---

# GIAI ĐOẠN 6: ADVANCED FEATURES & OPTIMIZATION

**Mục tiêu:** Hoàn thiện ứng dụng với các tính năng nâng cao

**Tính năng:**
- ✅ Toast notifications (thay alert)
- ✅ Loading skeleton screens
- ✅ Error boundaries
- ✅ Search với debounce
- ✅ Export data to CSV
- ✅ Dark mode toggle
- ✅ Performance optimization

---

## 📢 Bước 6.1: Toast Notification System

**File: `src/components/common/Toast.jsx`**

```javascript
import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>✖️</button>
    </div>
  );
};

export default Toast;
```

**File: `src/components/common/Toast.css`**

```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-success {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.toast-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.toast-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #ffeaa7;
}

.toast-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 2px solid #bee5eb;
}

.toast-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.toast-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}
```

**File: `src/context/ToastContext.jsx`**

```javascript
import { createContext, useContext, useState } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
```

**Usage Example (Update `DriversPage.jsx`):**

```javascript
import { useToast } from '../context/ToastContext';

const DriversPage = () => {
  const { showToast } = useToast();

  const handleCreateDriver = async (driverData) => {
    try {
      await driverAPI.create(driverData);
      showToast('Tạo tài xế thành công!', 'success');
      // Remove: alert('✅ Tạo tài xế thành công!');
      setShowCreateModal(false);
      fetchDrivers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Không thể tạo tài xế', 'error');
    }
  };

  // Apply to all alert() calls...
};
```

---

## ⏳ Bước 6.2: Loading Skeleton Component

**File: `src/components/common/Skeleton.jsx`**

```javascript
import './Skeleton.css';

export const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton-cell skeleton-header-cell"></div>
        ))}
      </div>
      <div className="skeleton-table-body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-table-row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header"></div>
      <div className="skeleton-card-body">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  );
};
```

**File: `src/components/common/Skeleton.css`**

```css
.skeleton-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-table-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.skeleton-header-cell {
  height: 40px !important;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
}

.skeleton-table-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-table-row {
  display: flex;
  gap: 10px;
}

.skeleton-cell {
  height: 30px;
  flex: 1;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-card-header {
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 15px;
}

.skeleton-line {
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 60%;
}
```

**Usage in `DriversPage.jsx`:**

```javascript
import { SkeletonTable } from '../components/common/Skeleton';

// Replace loading spinner with skeleton
{loading ? (
  <SkeletonTable rows={10} columns={7} />
) : (
  <DriverTable ... />
)}
```

---

## 🔍 Bước 6.3: Search với Debounce Hook

**File: `src/hooks/useDebounce.js`**

```javascript
import { useState, useEffect } from 'react';

/**
 * Debounce hook to delay value updates
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

**Usage in `DriversPage.jsx`:**

```javascript
import useDebounce from '../hooks/useDebounce';

const DriversPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch drivers when debounced search changes
  useEffect(() => {
    fetchDrivers();
  }, [pagination.page, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    // Don't trigger fetch immediately, wait for debounce
  };

  return (
    <input 
      type="text"
      value={searchInput}
      onChange={handleSearchChange}
      placeholder="Tìm tài xế..."
    />
  );
};
```

---

## 📥 Bước 6.4: Export to CSV Utility

**File: `src/utils/exportCSV.js`**

```javascript
/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    alert('Không có dữ liệu để xuất');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = '\uFEFF'; // BOM for UTF-8
  csvContent += headers.join(',') + '\n';

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

**Usage in `DriversPage.jsx`:**

```javascript
import { exportToCSV } from '../utils/exportCSV';

const handleExport = () => {
  const exportData = drivers.map(driver => ({
    'Mã tài xế': driver.ma_tai_xe,
    'Loại xe': driver.loai_xe,
    'Rating': driver.rating,
    'Biển số xe': driver.bien_so_xe,
    'Ngày sinh': driver.ngay_sinh
  }));
  
  exportToCSV(exportData, 'drivers');
};

return (
  <button onClick={handleExport}>📥 Xuất CSV</button>
);
```

---

## 🌙 Bước 6.5: Dark Mode Toggle

**File: `src/context/ThemeContext.jsx`**

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**File: `src/styles/darkMode.css`**

```css
/* Dark Mode Styles */
body.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

body.dark-mode .page-header {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

body.dark-mode .driver-table,
body.dark-mode .order-table,
body.dark-mode .trip-table {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

body.dark-mode .driver-table thead,
body.dark-mode .order-table thead,
body.dark-mode .trip-table thead {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

body.dark-mode .driver-table tbody tr,
body.dark-mode .order-table tbody tr,
body.dark-mode .trip-table tbody tr {
  border-bottom: 1px solid #3a3a3a;
}

body.dark-mode .driver-table tbody tr:hover,
body.dark-mode .order-table tbody tr:hover,
body.dark-mode .trip-table tbody tr:hover {
  background-color: #3a3a3a;
}

body.dark-mode .modal-content {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

body.dark-mode input,
body.dark-mode select,
body.dark-mode textarea {
  background-color: #3a3a3a;
  color: #e0e0e0;
  border-color: #4a4a4a;
}

body.dark-mode .report-card {
  background-color: #2a2a2a;
}

/* Add more dark mode overrides as needed */
```

**Component: `src/components/common/ThemeToggle.jsx`**

```javascript
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
```

**File: `src/components/common/ThemeToggle.css`**

```css
.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  z-index: 1000;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.theme-toggle:active {
  transform: scale(0.95);
}
```

---

## 🛡️ Bước 6.6: Error Boundary Component

**File: `src/components/common/ErrorBoundary.jsx`**

```javascript
import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>🚨 Oops! Something went wrong</h1>
            <p>The application encountered an unexpected error.</p>
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
            <button onClick={this.handleReset}>
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**File: `src/components/common/ErrorBoundary.css`**

```css
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  text-align: center;
}

.error-content h1 {
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.error-content details {
  text-align: left;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.error-content pre {
  overflow-x: auto;
  font-size: 12px;
  color: #e74c3c;
}

.error-content button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.error-content button:hover {
  transform: scale(1.05);
}
```

**Usage in `App.jsx`:**

```javascript
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <Routes>
                {/* All routes */}
              </Routes>
              <ThemeToggle />
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
```

---

## ⚡ Bước 6.7: Performance Optimization Tips

**1. Code Splitting with React.lazy:**

```javascript
// App.jsx
import { lazy, Suspense } from 'react';

const DriversPage = lazy(() => import('./pages/DriversPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const DeliveryTripsPage = lazy(() => import('./pages/DeliveryTripsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

function App() {
  return (
    <Suspense fallback={<div className="loading-container">Loading...</div>}>
      <Routes>
        <Route path="/drivers" element={<DriversPage />} />
        {/* ... */}
      </Routes>
    </Suspense>
  );
}
```

**2. Memoization:**

```javascript
import { memo, useMemo, useCallback } from 'react';

const DriverTable = memo(({ drivers, onEdit, onDelete }) => {
  // Component won't re-render if props unchanged
});

const DriversPage = () => {
  const handleEdit = useCallback((driver) => {
    // Stable function reference
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => d.loai_xe === 'Xe tải');
  }, [drivers]);
};
```

**3. Virtualization for Long Lists:**

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

const VirtualizedDriverList = ({ drivers }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {drivers[index].ma_tai_xe}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={drivers.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

---

## 🔗 Bước 6.8: Final Integration

**Update `src/App.jsx` (Complete):**

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import ThemeToggle from './components/common/ThemeToggle';
import LoginPage from './pages/LoginPage';
import './styles/darkMode.css';

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DriversPage = lazy(() => import('./pages/DriversPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const DeliveryTripsPage = lazy(() => import('./pages/DeliveryTripsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <Suspense fallback={<div className="loading-container">⏳ Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                  } />
                  
                  <Route path="/drivers" element={
                    <ProtectedRoute><DriversPage /></ProtectedRoute>
                  } />
                  
                  <Route path="/orders" element={
                    <ProtectedRoute><OrdersPage /></ProtectedRoute>
                  } />
                  
                  <Route path="/delivery-trips" element={
                    <ProtectedRoute><DeliveryTripsPage /></ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute><ReportsPage /></ProtectedRoute>
                  } />
                  
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<div>404 - Not Found</div>} />
                </Routes>
              </Suspense>
              
              <ThemeToggle />
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Bước 6.9: Final Testing Checklist

### Advanced Features Test:

1. **Toast Notifications:**
   - [ ] Create/edit/delete actions → verify toasts appear
   - [ ] Check toast auto-dismiss after 3s
   - [ ] Multiple toasts stack correctly

2. **Loading Skeletons:**
   - [ ] Navigate to pages → verify skeleton appears before data
   - [ ] Check skeleton matches table structure

3. **Search Debounce:**
   - [ ] Type in search → verify API called after 500ms delay
   - [ ] Type quickly → verify only 1 API call

4. **Export CSV:**
   - [ ] Click export → verify CSV file downloads
   - [ ] Open CSV → verify data correct with UTF-8 encoding

5. **Dark Mode:**
   - [ ] Click theme toggle → verify dark mode applied
   - [ ] Refresh page → verify theme persisted
   - [ ] Check all pages in dark mode

6. **Error Boundary:**
   - [ ] Trigger error → verify error boundary catches it
   - [ ] Click "Go to Dashboard" → verify redirects

7. **Performance:**
   - [ ] Check page load times
   - [ ] Navigate between pages → verify fast transitions
   - [ ] Scroll long lists → verify smooth performance

---

## 🎉 KẾT QUẢ GIAI ĐOẠN 6

✅ **Đã hoàn thành:**
- Toast notification system (replace alerts)
- Loading skeleton screens
- Error boundary component
- Search với debounce hook
- Export to CSV utility
- Dark mode với localStorage persistence
- Performance optimizations (lazy loading, memoization)
- Theme toggle button
- Complete App.jsx integration

✅ **Advanced Features:**
- **Toast System**: 4 types (success/error/warning/info), auto-dismiss, stackable
- **Skeletons**: Animated loading states for better UX
- **Debounce**: Reduce API calls with 500ms delay
- **CSV Export**: UTF-8 support, auto-filename with date
- **Dark Mode**: Full app theming, persistent preference
- **Error Handling**: Graceful error boundaries with reset
- **Code Splitting**: Lazy load pages for faster initial load
- **Memoization**: Prevent unnecessary re-renders

---


### 📋 TÓM TẮT TOÀN BỘ PROJECT:

**Stage 1**: Setup & Authentication ✅  
**Stage 2**: Driver Management (CRUD) ✅  
**Stage 3**: Order Management (11 statuses, auto-calculate) ✅  
**Stage 4**: Delivery Trip Management ✅  
**Stage 5**: Reports & Analytics (Top drivers/customers) ✅  
**Stage 6**: Advanced Features (Toast, Dark mode, Export, etc.) ✅  

---

