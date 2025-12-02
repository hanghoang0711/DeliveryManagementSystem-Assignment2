import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; 

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const result = await login(formData.username, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

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
                    {/* Header: Logo ALALA */}
                    <div className="login-header">
                        <h1>ALALA</h1>
                        <p>Đăng nhập hệ thống quản lý</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
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

                        {error && (
                            <div className="error-message">
                                ❌ {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

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
                        <p>Thông tin đăng nhập mẫu:</p>
                        <p>User: <strong>sManager</strong> - Pass: <strong>Nhom6251</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;