import axios from 'axios';

const api = axios.create({
  // Update this with your actual API Gateway URL
  baseURL: 'http://localhost:8095',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling tokens (if needed in the future)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
