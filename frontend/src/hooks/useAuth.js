import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { setAuth, logout: clearAuth, user, isAuthenticated, isAdmin, isEditor, canManageBlogs } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isFetchingMe } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await authAPI.getMe();
      setAuth(data.data.user, useAuthStore.getState().accessToken);
      return data.data.user;
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      queryClient.invalidateQueries(['me']);
      toast.success(`Welcome back, ${data.data.user.username}!`);
      const role = data.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'editor') navigate('/dashboard');
      else navigate('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Account created! Welcome aboard.');
      navigate('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/');
      toast.success('Logged out successfully');
    },
  });

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    isEditor: isEditor(),
    canManageBlogs: canManageBlogs(),
    isFetchingMe,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
  };
};
