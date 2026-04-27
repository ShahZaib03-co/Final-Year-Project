import api from './axiosClient';

// ========================
// Auth API
// ========================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.patch('/auth/update-password', data),
};

// ========================
// Blog API
// ========================
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slugOrId) => api.get(`/blogs/${slugOrId}`),
  create: (formData) =>
    api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.patch(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
};

// ========================
// Comment API
// ========================
export const commentAPI = {
  getByBlog: (blogId) => api.get(`/blogs/${blogId}/comments`),
  create: (blogId, data) => api.post(`/blogs/${blogId}/comments`, data),
  update: (id, data) => api.patch(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`),
};

// ========================
// User API
// ========================
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.patch(`/users/${id}/status`),
  delete: (id) => api.delete(`/users/${id}`),
  updateProfile: (formData) =>
    api.patch('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAdminStats: () => api.get('/users/admin/stats'),
};
