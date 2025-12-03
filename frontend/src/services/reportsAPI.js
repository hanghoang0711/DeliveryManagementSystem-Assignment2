import api from '../api/axios';

const reportsAPI = {
  /**
   * Get top drivers by rating
   * @param {Object} params - { limit }
   */
  getTopDrivers: async (params = { topN: 10 }) => {
    try {
      const response = await api.get('/api/bao-cao/top-tai-xe', { params });
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
  getTopCustomers: async (params = { topN: 10 }) => {
    try {
      const response = await api.get('/api/bao-cao/top-khach-hang', { params });
      return response.data;
    } catch (error) {
      console.error('Get top customers error:', error);
      throw error;
    }
  }
};

export default reportsAPI;