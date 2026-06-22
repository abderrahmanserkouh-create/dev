import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: data => api.put('/auth/profile', data),
};

export const productAPI = {
  getAll: params => api.get('/products', { params }),
  getById: id => api.get(`/products/${id}`),
  getAllAdmin: params => api.get('/products/admin/all', { params }),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
};

export const userAPI = {
  getAll: params => api.get('/admin/users', { params }),
  getById: id => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: id => api.delete(`/admin/users/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: data => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: id => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (product_id, quantity = 1) => api.post('/cart', { product_id, quantity }),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: id => api.delete(`/cart/${id}`),
};

export const orderAPI = {
  checkout: () => api.post('/orders'),
  getMyOrders: () => api.get('/orders'),
  getById: id => api.get(`/orders/${id}`),
  getAll: params => api.get('/orders/all', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const favoriteAPI = {
  get: () => api.get('/favorites'),
  toggle: productId => api.post(`/favorites/${productId}`),
  check: productId => api.get(`/favorites/${productId}/check`),
};

export default api;
