import { create } from 'zustand';
import authService from '../api/authService';
import userService from '../api/userService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Fetch the logged-in user's profile from /api/user/me
  fetchUser: async () => {
    try {
      const response = await userService.getMe();
      if (response.success) {
        set({ user: response.data });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true, isLoading: false });
        // Fetch user profile immediately after login
        await get().fetchUser();
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false, message: response.message };
    } catch (error) {
      const message = typeof error === 'string' ? error : error.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(userData);
      if (response.success) {
        set({ isLoading: false });
        return { success: true };
      }
      set({ isLoading: false, error: response.message });
      return { success: false, message: response.message };
    } catch (error) {
      const message = typeof error === 'string' ? error : error.message || 'Signup failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        set({ isLoading: false });
        return { success: true };
      }
      set({ isLoading: false, error: response.message });
      return { success: false, message: response.message };
    } catch (error) {
      const message = typeof error === 'string' ? error : error.message || 'Verification failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    set({ isAuthenticated: true });
    // Fetch user profile if we have a token but no user data
    if (!get().user) {
      await get().fetchUser();
    }
  },

  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  }
}));

export default useAuthStore;
