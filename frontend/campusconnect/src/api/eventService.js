import api from './axios';

const eventService = {
  // Get events (optionally filtered by college)
  getEvents: async (collegeName) => {
    try {
      const url = collegeName 
        ? `/api/events?collegeName=${encodeURIComponent(collegeName)}`
        : '/api/events';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single event
  getEvent: async (eventId) => {
    try {
      const response = await api.get(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/api/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // RSVP to an event
  rsvp: async (eventId, userId, userName) => {
    try {
      const response = await api.post(`/api/events/${eventId}/rsvp?userId=${userId}&userName=${encodeURIComponent(userName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel RSVP
  cancelRsvp: async (eventId, userId) => {
    try {
      const response = await api.delete(`/api/events/${eventId}/rsvp?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's RSVP'd event IDs
  getUserRsvps: async (userId) => {
    try {
      const response = await api.get(`/api/events/user-rsvps?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get attendees for an event
  getAttendees: async (eventId) => {
    try {
      const response = await api.get(`/api/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default eventService;
