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
  // Change user password
  changePassword: async (data) => {
    try {
      const response = await api.put('/api/user/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Follow a user
  followUser: async (targetUserId) => {
    try {
      const response = await api.post(`/api/user/follow/${targetUserId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Unfollow a user
  unfollowUser: async (targetUserId) => {
    try {
      const response = await api.delete(`/api/user/follow/${targetUserId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Get followers
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/api/user/${userId}/followers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Get following
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/api/user/${userId}/following`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
