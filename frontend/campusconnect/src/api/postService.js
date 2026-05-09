import api from './axios';

const postService = {
  // Get the global feed
  getFeed: async (userId, page = 0, size = 10) => {
    try {
      const url = userId 
        ? `/api/posts/feed?userId=${userId}&page=${page}&size=${size}`
        : `/api/posts/feed?page=${page}&size=${size}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get college-specific feed
  getCollegeFeed: async (userId, collegeName, page = 0, size = 10) => {
    try {
      const url = userId 
        ? `/api/posts/feed/college?userId=${userId}&collegeName=${encodeURIComponent(collegeName)}&page=${page}&size=${size}`
        : `/api/posts/feed/college?collegeName=${encodeURIComponent(collegeName)}&page=${page}&size=${size}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Toggle like on a post
  toggleLike: async (postId, userId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    try {
      const response = await api.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Upload a file (image/video)
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Get posts for a specific user
  getUserPosts: async (currentUserId, targetUserId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/posts/user/${targetUserId}`, {
        params: { currentUserId, page, size },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default postService;
