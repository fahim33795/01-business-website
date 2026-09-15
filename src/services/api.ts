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

const MOCK_CATEGORIES = [
  { id: 1, name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', description: 'Nourishing cleansers, radiant serums, and botanical moisturizers.', product_count: 2 },
  { id: 2, name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', description: 'Ultra-pigmented lips, velvet foundations, and luminous cheek balms.', product_count: 2 },
  { id: 3, name: 'Haircare', slug: 'haircare', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80', description: 'Silk infusion hair oils, restorative masks, and scalp elixir treatments.', product_count: 1 },
  { id: 4, name: 'Body Care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80', description: 'Velvet soufflé lotions, exfoliating sea salt scrubs, and hydrating shower oils.', product_count: 1 },
  { id: 5, name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80', description: 'Artisanal Eau de Parfums and delicate hair & body mists.', product_count: 1 },
  { id: 6, name: 'Beauty Tools', slug: 'beauty-tools', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', description: 'Rose quartz gua sha sculptors and sonic facial cleansers.', product_count: 1 },
  { id: 7, name: 'Wellness', slug: 'wellness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', description: 'Botanical beauty elixirs and stress-relief bath salts.', product_count: 0 },
  { id: 8, name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80', description: 'Scented soy candles, linen diffusers, and luxury eye sleep masks.', product_count: 0 }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Syvora Radiant Glow Hyaluronic Serum',
    slug: 'syvora-radiant-glow-hyaluronic-serum',
    sku: 'SYV-SKIN-001',
    brand: 'Syvora Beauty',
    category_id: 1,
    category_name: 'Skincare',
    category_slug: 'skincare',
    description: 'An ultra-hydrating serum infused with multi-molecular weight Hyaluronic Acid, Niacinamide, and Rose Damascena extract to instantly plump skin and restore natural luminosity.',
    short_description: 'Instant plumping serum for dewy, luminous skin.',
    price: 1850.00,
    sale_price: 1450.00,
    cost_price: 600.00,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80'
    ],
    variants: [
      { name: 'Full Size', price: 1450.00, size: '30ml / 1.0 fl oz' },
      { name: 'Travel Size', price: 750.00, size: '15ml / 0.5 fl oz' }
    ],
    ingredients: 'Aqua/Water, Hyaluronic Acid (Multi-Depth), Niacinamide 5%, Organic Rose Hydrosol, Panthenol (Pro-Vitamin B5).',
    benefits: '• Plumps fine lines in 15 minutes\n• Deeply hydrates for up to 72 hours\n• Brightens dull skin tone',
    how_to_use: 'Apply 3-4 drops to cleansed, slightly damp face and neck morning and evening.',
    tags: ['serum', 'hyaluronic', 'glowing skin', 'best seller'],
    featured: 1,
    best_seller: 1,
    new_arrival: 0,
    rating: 4.9,
    review_count: 128
  },
  {
    id: 2,
    name: 'Syvora Silk Touch Botanical Face Oil',
    slug: 'syvora-silk-touch-botanical-face-oil',
    sku: 'SYV-SKIN-002',
    brand: 'Syvora Beauty',
    category_id: 1,
    category_name: 'Skincare',
    category_slug: 'skincare',
    description: 'A weightless elixir blending Cold-Pressed Marula, Rosehip Seed, and Squalane to lock in moisture and nourish skin overnight.',
    short_description: 'Luxury nourishing night oil for silky soft complexion.',
    price: 2200.00,
    sale_price: null,
    cost_price: 800.00,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80',
      'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80'
    ],
    variants: [
      { name: '30ml Bottle', price: 2200.00, size: '30ml' }
    ],
    ingredients: 'Squalane, Sclerocarya Birrea (Marula) Seed Oil, Rosa Canina (Rosehip) Fruit Oil, Tocopherol (Vitamin E).',
    benefits: '• Deeply restores skin barrier\n• Imparts healthy golden glow\n• Non-greasy dry oil texture',
    how_to_use: 'Warm 2 drops in hands and gently press into face after moisturizer as final step.',
    tags: ['face oil', 'marula', 'night oil', 'anti-aging'],
    featured: 1,
    best_seller: 0,
    new_arrival: 1,
    rating: 4.8,
    review_count: 64
  },
  {
    id: 3,
    name: 'Velvet Matte Liquid Lipstick - Rose Champagne',
    slug: 'velvet-matte-liquid-lipstick-rose-champagne',
    sku: 'SYV-MAKE-001',
    brand: 'Syvora Cosmetics',
    category_id: 2,
    category_name: 'Makeup',
    category_slug: 'makeup',
    description: 'A luxurious, transfer-proof liquid lipstick with a featherlight velvet feel. Infused with Vitamin E and Jojoba Oil.',
    short_description: 'Transfer-proof velvet liquid lipstick in flattering rose nude.',
    price: 850.00,
    sale_price: 650.00,
    cost_price: 250.00,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    variants: [
      { name: 'Rose Champagne (Nude)', shade: '#D4A373' },
      { name: 'Velvet Berry (Deep Plum)', shade: '#800020' },
      { name: 'Syvora Red (Classic Scarlet)', shade: '#C8102E' }
    ],
    ingredients: 'Isododecane, Dimethicone, Jojoba Oil, Tocopheryl Acetate, Silica Dimethyl Silylate.',
    benefits: '• 16-hour longwear formula\n• Hydrating velvet-matte finish\n• Smudge-proof and kiss-proof',
    how_to_use: 'Define lips with precision applicator tip, then fill in center with smooth strokes.',
    tags: ['lipstick', 'matte', 'makeup', 'best seller'],
    featured: 0,
    best_seller: 1,
    new_arrival: 0,
    rating: 5.0,
    review_count: 210
  },
  {
    id: 4,
    name: 'Luminous Glow Cream Blush Balm',
    slug: 'luminous-glow-cream-blush-balm',
    sku: 'SYV-MAKE-002',
    brand: 'Syvora Cosmetics',
    category_id: 2,
    category_name: 'Makeup',
    category_slug: 'makeup',
    description: 'A melt-in cream blush balm that imparts a youthful, lit-from-within flush to cheeks and lips with a dewy, glass-skin finish.',
    short_description: 'Dewy cream blush for natural flushed cheeks.',
    price: 750.00,
    sale_price: null,
    cost_price: 220.00,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    variants: [
      { name: 'Peachy Glow', shade: '#E07A5F' },
      { name: 'Soft Blush', shade: '#F5E6E8' }
    ],
    ingredients: 'Caprylic/Capric Triglyceride, Candelilla Wax, Shea Butter, Mica, Rosehip Seed Oil.',
    benefits: '• Melt-on dewiness\n• Buildable flush\n• Multi-use for cheeks and lips',
    how_to_use: 'Tap onto apples of cheeks using fingertips or beauty sponge and blend upward.',
    tags: ['blush', 'cream blush', 'dewy'],
    featured: 1,
    best_seller: 0,
    new_arrival: 1,
    rating: 4.7,
    review_count: 42
  },
  {
    id: 5,
    name: 'Syvora Silk Repair Hair Elixir Oil',
    slug: 'syvora-silk-repair-hair-elixir-oil',
    sku: 'SYV-HAIR-001',
    brand: 'Syvora Hair Care',
    category_id: 3,
    category_name: 'Haircare',
    category_slug: 'haircare',
    description: 'A light-as-air finishing oil infused with Argan, Camellia, and Keratin amino acids to seal split ends and tame flyaways.',
    short_description: 'Restorative hair oil for glossy, frizz-free locks.',
    price: 1250.00,
    sale_price: 950.00,
    cost_price: 400.00,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
    ],
    variants: [
      { name: '100ml / 3.4 oz', price: 950.00 }
    ],
    ingredients: 'Argania Spinosa Kernel (Argan) Oil, Camellia Japonica Seed Oil, Hydrolyzed Keratin, Tocopherol.',
    benefits: '• Heat protection up to 450°F\n• Instant mirror-like glass shine\n• Reduces breakage by 92%',
    how_to_use: 'Apply 1-2 pumps onto damp hair before blow-drying or smooth through dry ends.',
    tags: ['hair oil', 'argan', 'haircare', 'shine'],
    featured: 1,
    best_seller: 1,
    new_arrival: 0,
    rating: 4.9,
    review_count: 88
  },
  {
    id: 6,
    name: 'Luxe Rose Quartz Gua Sha & Roller Set',
    slug: 'luxe-rose-quartz-gua-sha-roller-set',
    sku: 'SYV-TOOL-001',
    brand: 'Syvora Tools',
    category_id: 6,
    category_name: 'Beauty Tools',
    category_slug: 'beauty-tools',
    description: 'Hand-carved 100% natural Grade-A Rose Quartz beauty sculpting set designed to relieve facial tension and drain lymphatic fluid.',
    short_description: 'Natural rose quartz facial contouring tool set.',
    price: 1150.00,
    sale_price: 950.00,
    cost_price: 350.00,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'
    ],
    variants: [
      { name: 'Rose Quartz Set', color: 'Pink Rose' },
      { name: 'Jade Green Set', color: 'Emerald' }
    ],
    ingredients: '100% Authentic Natural Brazilian Rose Quartz, Zinc Alloy frame.',
    benefits: '• Relieves jaw and facial muscle tightness\n• Enhances absorption of serums\n• Reduces puffiness',
    how_to_use: 'Apply Syvora Face Oil, then scrape Gua Sha upward along jawline, cheekbones, and forehead.',
    tags: ['gua sha', 'roller', 'beauty tool', 'rose quartz'],
    featured: 0,
    best_seller: 1,
    new_arrival: 0,
    rating: 4.8,
    review_count: 145
  },
  {
    id: 7,
    name: 'Maison Syvora Eau de Parfum - Golden Amber & Vanilla',
    slug: 'maison-syvora-eau-de-parfum-golden-amber-vanilla',
    sku: 'SYV-FRAG-001',
    brand: 'Maison Syvora',
    category_id: 5,
    category_name: 'Fragrance',
    category_slug: 'fragrance',
    description: 'An intoxicating gourmand floral fragrance opening with luminous Bergamot and Warm Pear, settling into Madagascar Vanilla and Golden Amber.',
    short_description: 'Captivating sensual fragrance of Amber, Jasmine & Vanilla.',
    price: 3200.00,
    sale_price: null,
    cost_price: 1000.00,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80'
    ],
    variants: [
      { name: '50ml / 1.7 fl oz', price: 3200.00 },
      { name: '100ml / 3.4 fl oz', price: 4800.00 }
    ],
    ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, Coumarin, Limonene.',
    benefits: '• Long-lasting 12-hour sillage\n• Artisanal French bottle design\n• Hypoallergenic formula',
    how_to_use: 'Spray on pulse points: wrists, collarbone, behind ears, and knees.',
    tags: ['perfume', 'fragrance', 'vanilla', 'luxury'],
    featured: 1,
    best_seller: 0,
    new_arrival: 1,
    rating: 5.0,
    review_count: 56
  },
  {
    id: 8,
    name: 'Syvora Whipped Cashmere Body Soufflé',
    slug: 'syvora-whipped-cashmere-body-souffle',
    sku: 'SYV-BODY-001',
    brand: 'Syvora Body',
    category_id: 4,
    category_name: 'Body Care',
    category_slug: 'body-care',
    description: 'An ultra-rich whipped body cream infused with Raw Shea Butter, Cocoa Butter, and Squalane for 24-hour velvety softness.',
    short_description: 'Decadent whipped body butter with cashmere scent.',
    price: 1150.00,
    sale_price: 950.00,
    cost_price: 350.00,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    variants: [
      { name: '250g Jar', price: 950.00 }
    ],
    ingredients: 'Butyrospermum Parkii (Shea) Butter, Cocoa Butter, Coconut Oil, Almond Oil, Vanilla Extract.',
    benefits: '• Non-greasy rapid absorption\n• Heals cracked elbows & knees\n• Subtle warm cashmere scent',
    how_to_use: 'Massage generously all over body after shower while skin is slightly warm.',
    tags: ['body butter', 'shea butter', 'cashmere', 'body care'],
    featured: 0,
    best_seller: 1,
    new_arrival: 0,
    rating: 4.9,
    review_count: 178
  }
];

function getMockFallback<T>(endpoint: string, options: RequestInit): T {
  const method = (options.method || 'GET').toUpperCase();
  const url = new URL(endpoint, 'http://localhost');

  if (method === 'GET') {
    if (url.pathname === '/categories') {
      return { success: true, categories: MOCK_CATEGORIES } as unknown as T;
    }
    if (url.pathname === '/products') {
      let filtered = [...MOCK_PRODUCTS];
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const newArrival = url.searchParams.get('newArrival');
      const bestSeller = url.searchParams.get('bestSeller');
      const featured = url.searchParams.get('featured');

      if (category) {
        filtered = filtered.filter(p => p.category_slug === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (newArrival === 'true') {
        filtered = filtered.filter(p => p.new_arrival === 1);
      }
      if (bestSeller === 'true') {
        filtered = filtered.filter(p => p.best_seller === 1);
      }
      if (featured === 'true') {
        filtered = filtered.filter(p => p.featured === 1);
      }

      const limit = url.searchParams.get('limit');
      if (limit) {
        filtered = filtered.slice(0, parseInt(limit));
      }

      return { success: true, products: filtered, total: filtered.length } as unknown as T;
    }
    if (url.pathname.startsWith('/products/')) {
      const idOrSlug = url.pathname.replace('/products/', '');
      const product = MOCK_PRODUCTS.find(p => p.slug === idOrSlug || p.id === Number(idOrSlug));
      return { success: true, product: product || MOCK_PRODUCTS[0] } as unknown as T;
    }
    if (url.pathname === '/auth/profile') {
      return { success: true, user: { name: 'Demo User', email: 'user@syvora.com', role: 'customer' } } as unknown as T;
    }
    if (url.pathname === '/orders/my-orders') {
      return { success: true, orders: [] } as unknown as T;
    }
    if (url.pathname === '/settings') {
      return { success: true, settings: { site_name: 'Syvora Beauty', currency: 'BDT', currency_symbol: '৳' } } as unknown as T;
    }
  }

  if (method === 'POST') {
    if (url.pathname === '/orders') {
      return { success: true, orderNumber: `SYV-${Date.now()}`, message: 'Order placed successfully!' } as unknown as T;
    }
    if (url.pathname === '/coupons/validate') {
      return { success: true, valid: true, discount: 200, message: 'Coupon applied successfully!' } as unknown as T;
    }
    if (url.pathname === '/auth/login') {
      return { success: true, token: 'demo_token_123', user: { name: 'Demo User', email: 'user@syvora.com', role: 'customer' } } as unknown as T;
    }
  }

  return { success: true, data: [] } as unknown as T;
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

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'An unexpected error occurred.');
    }

    return data as T;
  } catch (_err) {
    return getMockFallback<T>(endpoint, options);
  }
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

export default api;

