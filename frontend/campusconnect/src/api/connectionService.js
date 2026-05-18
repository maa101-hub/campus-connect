import api from './axios';

const connectionService = {
  // Send a connection request
  sendRequest: async (requesterId, receiverId) => {
    try {
      const response = await api.post('/api/connections/request', { requesterId, receiverId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Accept a connection request
  acceptRequest: async (connectionId, userId) => {
    try {
      const response = await api.post(`/api/connections/${connectionId}/accept?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject a connection request
  rejectRequest: async (connectionId, userId) => {
    try {
      const response = await api.post(`/api/connections/${connectionId}/reject?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get pending requests for user
  getPendingRequests: async (userId) => {
    try {
      const response = await api.get(`/api/connections/pending?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get connected friend IDs
  getFriends: async (userId) => {
    try {
      const response = await api.get(`/api/connections/friends?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get connection status between two users
  getStatus: async (userId1, userId2) => {
    try {
      const response = await api.get(`/api/connections/status?userId1=${userId1}&userId2=${userId2}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default connectionService;
