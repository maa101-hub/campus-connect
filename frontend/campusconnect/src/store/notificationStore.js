import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadMessageCount: 0,
  unreadNotificationCount: 0,
  incomingMessage: null, // Used to trigger updates in MessagingSection
  typingStatus: {}, // { senderId: boolean }
  readReceiptTrigger: null, // { readerId: 123, timestamp: Date.now() }

  // Add a general notification
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadNotificationCount: state.unreadNotificationCount + 1
  })),

  // Handle incoming chat message globally
  receiveMessage: (message) => set((state) => ({
    incomingMessage: message,
    unreadMessageCount: state.unreadMessageCount + 1
  })),

  setTyping: (senderId, isTyping) => set((state) => ({
    typingStatus: { ...state.typingStatus, [senderId]: isTyping }
  })),

  setReadReceiptTrigger: (readerId) => set({ 
    readReceiptTrigger: { readerId, timestamp: Date.now() } 
  }),

  clearIncomingMessage: () => set({ incomingMessage: null }),

  markMessagesAsRead: () => set({ unreadMessageCount: 0 }),
  
  markNotificationsAsRead: () => set({ unreadNotificationCount: 0, notifications: [] }),
}));

export default useNotificationStore;
