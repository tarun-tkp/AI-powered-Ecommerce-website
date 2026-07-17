import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('shopai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || 'An error occurred';
    return Promise.reject(new Error(msg));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTopRated: () => api.get('/products/top-rated'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getSimilar: (id, categoryId) => api.get(`/products/${id}/similar`, { params: { categoryId } }),
  search: (q, page = 0, size = 12) => api.get('/products/search', { params: { q, page, size } }),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  toggle: (productId) => api.post(`/wishlist/${productId}`),
  check: (productId) => api.get(`/wishlist/${productId}/check`),
};

export const orderAPI = {
  place: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  add: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getSummary: (productId, productName) => api.get(`/reviews/product/${productId}/summary`, { params: { productName } }),
};

export const couponAPI = {
  validate: (code, orderAmount) => api.get(`/coupons/validate/${code}`, { params: { orderAmount } }),
};

export const chatAPI = {
  sendMessage: (message) => api.get('/chat', { params: { message } }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getUsers: () => api.get('/admin/users'),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};

export default api;
