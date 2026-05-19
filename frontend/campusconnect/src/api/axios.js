import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8095',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor for handling tokens on requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (JWT expired/invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/?expired=true';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be down');
    }

    return Promise.reject(error);
  }
);

export default api;
