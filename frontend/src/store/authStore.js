import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),

      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),

      // Role helpers
      isAdmin: () => get().user?.role === 'admin',
      isEditor: () => ['admin', 'editor'].includes(get().user?.role),
      hasRole: (role) => get().user?.role === role,
      canManageBlogs: () => ['admin', 'editor'].includes(get().user?.role),
    }),
    {
      name: 'auth-storage',
      // Only persist non-sensitive fields (token stays in memory / cookie)
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
