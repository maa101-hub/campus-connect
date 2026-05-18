import api from './axios';

const userService = {
  // Get current logged-in user's profile
  getMe: async () => {
    try {
      const response = await api.get('/api/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Get all verified users from a specific college
  getCollegeUsers: async (collegeName) => {
    try {
      const response = await api.get(`/api/user/college?collegeName=${encodeURIComponent(collegeName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Update user profile information
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/user/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/user/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
