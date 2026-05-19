import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('cc-theme') || 'dark',
  
  toggleTheme: () => set((state) => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('cc-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    return { theme: next };
  }),

  setTheme: (theme) => {
    localStorage.setItem('cc-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  initTheme: () => {
    const saved = localStorage.getItem('cc-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    set({ theme: saved });
  }
}));

export default useThemeStore;
