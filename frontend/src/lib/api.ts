import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// Users API
export const usersApi = {
  getMe: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
};

// Servers API
export const serversApi = {
  getAll: (params?: any) => api.get('/servers', { params }),
  getBySlug: (slug: string) => api.get(`/servers/${slug}`),
  getMyServers: () => api.get('/servers/my-servers'),
  create: (data: any) => api.post('/servers', data),
  update: (id: string, data: any) => api.put(`/servers/${id}`, data),
  delete: (id: string) => api.delete(`/servers/${id}`),
  trackClick: (id: string, type: 'WEBSITE' | 'DISCORD' | 'CLIENT') =>
    api.post(`/servers/${id}/click/${type}`),
};

// Votes API
export const votesApi = {
  vote: (serverId: string) => api.post(`/votes/${serverId}`),
  getVoteCount: (serverId: string) => api.get(`/votes/${serverId}/count`),
  canVote: (serverId: string) => api.get(`/votes/${serverId}/can-vote`),
  getStats: (serverId: string) => api.get(`/votes/${serverId}/stats`),
};

// Admin API
export const adminApi = {
  getServers: (params?: any) => api.get('/admin/servers', { params }),
  updateServerStatus: (id: string, status: string) =>
    api.put(`/admin/servers/${id}/status`, { status }),
  deleteServer: (id: string) => api.delete(`/admin/servers/${id}`),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
};
