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