import api from './axios';

const messageService = {
  // Send a message to a user
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/api/messages/send', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get conversation with a specific user
  getConversation: async (otherUserId) => {
    try {
      const response = await api.get(`/api/messages/conversation/${otherUserId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get list of users with whom the current user has chatted
  getContacts: async () => {
    try {
      const response = await api.get('/api/messages/contacts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all messages from a user as read
  markAsRead: async (senderId) => {
    try {
      const response = await api.post(`/api/messages/read/${senderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageService;
