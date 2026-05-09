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
      // Save token if successful
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
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
