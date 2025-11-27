// src/api/services.js
import axios from './axios';

/**
 * ============================
 * AUTH API
 * ============================
 */
export const authAPI = {
  /**
   * Đăng nhập  
   * @param {Object} credentials - {username, password}
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
   */
  logout: async () => {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Test quyền admin
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

/**
 * ============================
 * DRIVER API
 * ============================
 */
export const driverAPI = {
  /**
   * Lấy danh sách tất cả tài xế
   * Tự động lấy đúng mảng (array) từ response
   */
  getAll: async () => {
    try {
      const response = await axios.get('/api/driver');
      const data = response.data;

      // Trường hợp backend trả về trực tiếp là mảng
      if (Array.isArray(data)) return data;

      // Trường hợp backend trả về { data: [...] }
      if (Array.isArray(data?.data)) return data.data;

      // Trường hợp backend trả về { drivers: [...] }
      if (Array.isArray(data?.drivers)) return data.drivers;

      console.warn('⚠ /api/driver trả về format lạ:', data);
      return [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin tài xế theo ID
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
   */
  create: async (driverData) => {
    try {
      const response = await axios.post('api/driver', driverData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật thông tin tài xế
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
      const response = await axios.put(`'api/don-hang/${id}`, orderData);
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