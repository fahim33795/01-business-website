const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('syvora_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('syvora_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('syvora_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'An unexpected error occurred.');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request<any>('/auth/profile'),
  updateProfile: (body: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body: any) => request<any>('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),

  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    return request<any>(`/products?${query.toString()}`);
  },
  getProduct: (identifier: string) => request<any>(`/products/${identifier}`),
  searchSuggestions: (q: string) => request<any>(`/products/search/suggestions?q=${encodeURIComponent(q)}`),
  createProduct: (body: any) => request<any>('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: number, body: any) => request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: number) => request<any>(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (includeInactive = false) => request<any>(`/categories${includeInactive ? '?includeInactive=true' : ''}`),
  createCategory: (body: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: number, body: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: number) => request<any>(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (body: any) => request<any>('/orders', { method: 'POST', body: JSON.stringify(body) }),
  trackOrder: (orderNumber: string) => request<any>(`/orders/track/${encodeURIComponent(orderNumber)}`),
  getMyOrders: () => request<any>('/orders/my-orders'),
  getInvoice: (id: string | number) => request<any>(`/orders/invoice/${id}`),
  getAllOrders: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<any>(`/orders?${query}`);
  },
  updateOrderStatus: (id: number, body: any) => request<any>(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Coupons
  validateCoupon: (code: string, subtotal: number) => request<any>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  getCoupons: () => request<any>('/coupons'),
  createCoupon: (body: any) => request<any>('/coupons', { method: 'POST', body: JSON.stringify(body) }),
  deleteCoupon: (id: number) => request<any>(`/coupons/${id}`, { method: 'DELETE' }),

  // Reviews
  getProductReviews: (productId: number) => request<any>(`/reviews/product/${productId}`),
  submitReview: (body: any) => request<any>('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getAllReviews: () => request<any>('/reviews'),
  updateReviewStatus: (id: number, body: any) => request<any>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Admin Dashboard
  getAdminStats: () => request<any>('/admin/stats'),
  getAdminCustomers: () => request<any>('/admin/customers'),
  getAdminInventory: () => request<any>('/admin/inventory'),
  updateStockBulk: (updates: any[]) => request<any>('/admin/inventory/bulk', { method: 'PUT', body: JSON.stringify({ updates }) }),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (body: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  getBanners: () => request<any>('/banners'),
};
