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