import api from '../api/axios';

const deliveryTripAPI = {
  /**
   * Get all delivery trips
   * @param {Object} params - { page, limit, status, ma_tai_xe, sortBy, sortOrder }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/api/chuyen-giao-hang', { params });
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
      const response = await api.get(`/api/chuyen-giao-hang/${id}`);
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
      const response = await api.post('/api/chuyen-giao-hang', tripData);
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
      const response = await api.post(`/api/chuyen-giao-hang/${tripId}/orders`, orderData);
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
      const response = await api.put(`/api/chuyen-giao-hang/${id}`, updateData);
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
      const response = await api.delete(`/api/chuyen-giao-hang/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete delivery trip error:', error);
      throw error;
    }
  }
};

export default deliveryTripAPI;