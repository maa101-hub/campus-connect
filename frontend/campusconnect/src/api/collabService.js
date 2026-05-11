import api from './axios';

const collabService = {
  // Get opportunities with filtering
  getOpportunities: async (category = 'all', page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/collab`, {
        params: { category, page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new opportunity
  createOpportunity: async (data) => {
    try {
      const response = await api.post(`/api/collab`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Apply to opportunity
  apply: async (id) => {
    try {
      const response = await api.post(`/api/collab/${id}/apply`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete opportunity
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/collab/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default collabService;
