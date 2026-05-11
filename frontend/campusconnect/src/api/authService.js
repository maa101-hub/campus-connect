import api from './axios';

const authService = {
  signup: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      // Token storage is handled by authStore — don't duplicate it here
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendOtp: async (email) => {
    try {
      const response = await api.post(`/api/auth/send-otp?email=${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post(`/api/auth/verify-otp?email=${email}&otp=${otp}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export default authService;
