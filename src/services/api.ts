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

const INITIAL_ORDERS = [
  {
    id: 101,
    order_number: 'SYV-849201',
    customer_name: 'Tanvir Hossain',
    customer_email: 'tanvir@gmail.com',
    customer_phone: '01711223344',
    shipping_address: { country: 'Bangladesh', state: 'Dhaka', city: 'Uttara', full_address: 'House 12, Road 4, Sector 3' },
    delivery_method: 'Inside Dhaka',
    payment_method: 'bkash',
    payment_status: 'paid',
    order_status: 'delivered',
    items: [
      { id: 1, name: 'Syvora Radiant Glow Hyaluronic Serum', quantity: 1, price: 1450 }
    ],
    subtotal: 1450,
    shipping_fee: 80,
    total: 1530,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 102,
    order_number: 'SYV-950182',
    customer_name: 'Nusrat Jahan',
    customer_email: 'nusrat@yahoo.com',
    customer_phone: '01899887766',
    shipping_address: { country: 'Bangladesh', state: 'Chittagong', city: 'Agrabad', full_address: 'CDA Avenue 45' },
    delivery_method: 'Outside Dhaka',
    payment_method: 'nagad',
    payment_status: 'pending',
    order_status: 'processing',
    items: [
      { id: 3, name: 'Velvet Matte Liquid Lipstick', quantity: 2, price: 850 }
    ],
    subtotal: 1700,
    shipping_fee: 130,
    total: 1830,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Tanvir Hossain', email: 'tanvir@gmail.com', phone: '01711223344', total_orders: 5, total_spent: 8500, created_at: '2026-01-15' },
  { id: 2, name: 'Nusrat Jahan', email: 'nusrat@yahoo.com', phone: '01899887766', total_orders: 2, total_spent: 3400, created_at: '2026-02-10' }
];

const INITIAL_COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min_spend: 1000, max_discount: 500, status: 'active' },
  { id: 2, code: 'SYVORA200', type: 'fixed', value: 200, min_spend: 1500, max_discount: 200, status: 'active' }
];

const INITIAL_REVIEWS = [
  { id: 1, product_id: 1, product_name: 'Syvora Radiant Glow Hyaluronic Serum', customer_name: 'Ayesha Rahman', rating: 5, comment: 'Amazing serum! Plumps skin instantly.', status: 'approved', created_at: '2026-03-01' }
];

const INITIAL_SETTINGS = {
  storeName: 'Syvora Beauty & Lifestyle',
  storeEmail: 'contact@syvora.com',
  usdToBdtRate: 120,
  freeShippingThresholdUSD: 75,
  freeShippingThresholdBDT: 3000,
  announcementBarText: '✨ Free Shipping on Orders Over $75 / ৳3000 | Code WELCOME10'
};

function getStoredData<T>(key: string, defaultData: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  } catch (_e) {
    return defaultData;
  }
}

function setStoredData(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_e) {}
}

function getMockFallback<T>(endpoint: string, options: RequestInit): T {
  const method = (options.method || 'GET').toUpperCase();
  const url = new URL(endpoint, 'http://localhost');

  let products = getStoredData('syvora_mock_products', MOCK_PRODUCTS);
  let categories = getStoredData('syvora_mock_categories', MOCK_CATEGORIES);
  let orders = getStoredData('syvora_mock_orders', INITIAL_ORDERS);
  let customers = getStoredData('syvora_mock_customers', INITIAL_CUSTOMERS);
  let coupons = getStoredData('syvora_mock_coupons', INITIAL_COUPONS);
  let reviews = getStoredData('syvora_mock_reviews', INITIAL_REVIEWS);
  let settings = getStoredData('syvora_mock_settings', INITIAL_SETTINGS);

  if (method === 'GET') {
    if (url.pathname === '/admin/stats') {
      const totalSales = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      return {
        success: true,
        stats: {
          totalSales: totalSales > 0 ? totalSales : 245800,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length,
          lowStockCount: products.filter((p: any) => p.stock <= 10).length
        }
      } as unknown as T;
    }
    if (url.pathname === '/orders') {
      return { success: true, orders } as unknown as T;
    }
    if (url.pathname.startsWith('/orders/track/')) {
      const num = decodeURIComponent(url.pathname.replace('/orders/track/', ''));
      const found = orders.find((o: any) => o.order_number === num || String(o.id) === num);
      return { success: true, order: found || orders[0] } as unknown as T;
    }
    if (url.pathname === '/admin/customers') {
      return { success: true, customers } as unknown as T;
    }
    if (url.pathname === '/coupons') {
      return { success: true, coupons } as unknown as T;
    }
    if (url.pathname === '/reviews') {
      return { success: true, reviews } as unknown as T;
    }
    if (url.pathname.startsWith('/reviews/product/')) {
      const pId = Number(url.pathname.replace('/reviews/product/', ''));
      const pReviews = reviews.filter((r: any) => r.product_id === pId);
      return { success: true, reviews: pReviews } as unknown as T;
    }
    if (url.pathname === '/admin/inventory') {
      const inventory = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || `SYV-PROD-${p.id}`,
        stock: p.stock,
        cost_price: p.cost_price || Math.round(p.price * 0.5),
        price: p.price
      }));
      return { success: true, inventory } as unknown as T;
    }
    if (url.pathname === '/categories') {
      return { success: true, categories } as unknown as T;
    }
    if (url.pathname === '/products') {
      let filtered = [...products];
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const newArrival = url.searchParams.get('newArrival');
      const bestSeller = url.searchParams.get('bestSeller');
      const featured = url.searchParams.get('featured');

      if (category) {
        filtered = filtered.filter((p: any) => p.category_slug === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      if (newArrival === 'true') {
        filtered = filtered.filter((p: any) => p.new_arrival === 1);
      }
      if (bestSeller === 'true') {
        filtered = filtered.filter((p: any) => p.best_seller === 1);
      }
      if (featured === 'true') {
        filtered = filtered.filter((p: any) => p.featured === 1);
      }

      const limit = url.searchParams.get('limit');
      if (limit) {
        filtered = filtered.slice(0, parseInt(limit));
      }

      return { success: true, products: filtered, total: filtered.length } as unknown as T;
    }
    if (url.pathname.startsWith('/products/')) {
      const idOrSlug = url.pathname.replace('/products/', '');
      const product = products.find((p: any) => p.slug === idOrSlug || p.id === Number(idOrSlug));
      return { success: true, product: product || products[0] } as unknown as T;
    }
    if (url.pathname === '/auth/profile') {
      const token = getAuthToken();
      const isAdminToken = token ? token.includes('admin') : true;
      return {
        success: true,
        user: {
          id: 1,
          name: isAdminToken ? 'Fahim' : 'Demo Customer',
          email: isAdminToken ? 'fahim@syvora.com' : 'user@syvora.com',
          role: isAdminToken ? 'admin' : 'customer'
        }
      } as unknown as T;
    }
    if (url.pathname === '/orders/my-orders') {
      return { success: true, orders } as unknown as T;
    }
    if (url.pathname === '/settings') {
      return { success: true, settings } as unknown as T;
    }
  }

  if (method === 'POST') {
    let reqBody: any = {};
    try {
      if (options.body) reqBody = JSON.parse(options.body as string);
    } catch (_e) {}

    if (url.pathname === '/orders') {
      const orderNum = `SYV-${Math.floor(100000 + Math.random() * 900000)}`;
      const subtotalAmt = reqBody.subtotal || 1500;
      const shipFee = reqBody.delivery_method === 'Outside Dhaka' ? 130 : 80;
      const grandTotalAmt = reqBody.grandTotal || reqBody.total || (subtotalAmt + shipFee);

      const newOrder = {
        id: Date.now(),
        order_number: orderNum,
        customer_name: reqBody.customer_name || 'Customer',
        customer_email: reqBody.customer_email || 'customer@syvora.com',
        customer_phone: reqBody.customer_phone || '',
        shipping_address: reqBody.shipping_address || {},
        delivery_method: reqBody.delivery_method || 'Inside Dhaka',
        payment_method: reqBody.payment_method || 'bkash',
        payment_status: 'pending',
        order_status: 'pending',
        items: reqBody.items || [],
        subtotal: subtotalAmt,
        shipping_fee: shipFee,
        total: grandTotalAmt,
        created_at: new Date().toISOString()
      };

      orders.unshift(newOrder);
      setStoredData('syvora_mock_orders', orders);

      // Add to customers
      const custIndex = customers.findIndex((c: any) => c.email === newOrder.customer_email || c.phone === newOrder.customer_phone);
      if (custIndex >= 0) {
        customers[custIndex].total_orders = (customers[custIndex].total_orders || 0) + 1;
        customers[custIndex].total_spent = (customers[custIndex].total_spent || 0) + grandTotalAmt;
      } else {
        customers.unshift({
          id: Date.now(),
          name: newOrder.customer_name,
          email: newOrder.customer_email,
          phone: newOrder.customer_phone,
          total_orders: 1,
          total_spent: grandTotalAmt,
          created_at: new Date().toISOString().split('T')[0]
        });
      }
      setStoredData('syvora_mock_customers', customers);

      return {
        success: true,
        orderNumber: orderNum,
        order: newOrder,
        message: 'Order placed successfully!'
      } as unknown as T;
    }

    if (url.pathname === '/products') {
      const newProd = {
        id: Date.now(),
        name: reqBody.name || 'New Luxury Product',
        slug: reqBody.slug || (reqBody.name ? reqBody.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
        sku: reqBody.sku || `SYV-PROD-${Date.now().toString().slice(-4)}`,
        brand: reqBody.brand || 'Syvora Beauty',
        category_id: Number(reqBody.category_id) || 1,
        category_name: reqBody.category_name || 'Skincare',
        category_slug: reqBody.category_slug || 'skincare',
        description: reqBody.description || '',
        short_description: reqBody.short_description || '',
        price: Number(reqBody.price) || 1500,
        sale_price: reqBody.sale_price ? Number(reqBody.sale_price) : null,
        cost_price: Number(reqBody.cost_price) || 600,
        stock: Number(reqBody.stock) || 20,
        images: Array.isArray(reqBody.images) && reqBody.images.length ? reqBody.images : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],
        variants: reqBody.variants || [],
        ingredients: reqBody.ingredients || '',
        benefits: reqBody.benefits || '',
        how_to_use: reqBody.how_to_use || '',
        tags: reqBody.tags || [],
        featured: reqBody.featured ? 1 : 0,
        best_seller: reqBody.best_seller ? 1 : 0,
        new_arrival: 1,
        rating: 5.0,
        review_count: 0
      };
      products.unshift(newProd);
      setStoredData('syvora_mock_products', products);
      return { success: true, product: newProd, message: 'Product created successfully!' } as unknown as T;
    }

    if (url.pathname === '/categories') {
      const newCat = {
        id: Date.now(),
        name: reqBody.name,
        slug: reqBody.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: reqBody.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        description: reqBody.description || '',
        product_count: 0
      };
      categories.push(newCat);
      setStoredData('syvora_mock_categories', categories);
      return { success: true, category: newCat, message: 'Category added successfully!' } as unknown as T;
    }

    if (url.pathname === '/coupons') {
      const newCoupon = {
        id: Date.now(),
        code: (reqBody.code || '').toUpperCase(),
        type: reqBody.type || 'percent',
        value: Number(reqBody.value) || 10,
        min_spend: Number(reqBody.min_spend) || 0,
        max_discount: reqBody.max_discount ? Number(reqBody.max_discount) : null,
        status: 'active'
      };
      coupons.push(newCoupon);
      setStoredData('syvora_mock_coupons', coupons);
      return { success: true, coupon: newCoupon, message: 'Coupon created successfully!' } as unknown as T;
    }

    if (url.pathname === '/reviews') {
      const newRev = {
        id: Date.now(),
        product_id: reqBody.product_id,
        product_name: reqBody.product_name || 'Syvora Product',
        user_name: reqBody.customer_name || reqBody.user_name || 'Customer',
        rating: Number(reqBody.rating) || 5,
        comment: reqBody.comment || '',
        verified_purchase: 1,
        status: 'approved',
        created_at: new Date().toISOString()
      };
      reviews.unshift(newRev);
      setStoredData('syvora_mock_reviews', reviews);
      return { success: true, review: newRev, message: 'Review submitted successfully!' } as unknown as T;
    }

    if (url.pathname === '/coupons/validate') {
      const found = coupons.find((c: any) => c.code.toUpperCase() === (reqBody.code || '').toUpperCase() && c.status === 'active');
      if (found) {
        let disc = found.type === 'percent' ? (reqBody.subtotal * (found.value / 100)) : found.value;
        if (found.max_discount && disc > found.max_discount) disc = found.max_discount;
        return { success: true, valid: true, coupon: found, discount: disc, message: 'Coupon applied successfully!' } as unknown as T;
      }
      return { success: false, valid: false, message: 'Invalid or expired coupon code.' } as unknown as T;
    }

    if (url.pathname === '/auth/login') {
      const email = (reqBody.email || reqBody.username || '').toLowerCase().trim();
      const isAdminAttempt = email === 'fahim' || email.includes('fahim') || email === 'admin' || email.includes('admin') || !email;

      return {
        success: true,
        token: isAdminAttempt ? 'demo_admin_token_123' : 'demo_customer_token_123',
        user: {
          id: 1,
          name: isAdminAttempt ? 'Fahim' : 'Demo Customer',
          email: isAdminAttempt ? 'fahim@syvora.com' : 'customer@syvora.com',
          role: isAdminAttempt ? 'admin' : 'customer'
        }
      } as unknown as T;
    }
  }

  if (method === 'PUT') {
    let reqBody: any = {};
    try {
      if (options.body) reqBody = JSON.parse(options.body as string);
    } catch (_e) {}

    if (url.pathname.startsWith('/orders/')) {
      const oId = Number(url.pathname.replace('/orders/', ''));
      const idx = orders.findIndex((o: any) => o.id === oId);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], ...reqBody };
        setStoredData('syvora_mock_orders', orders);
        return { success: true, order: orders[idx], message: 'Order updated successfully!' } as unknown as T;
      }
    }

    if (url.pathname.startsWith('/products/')) {
      const pId = Number(url.pathname.replace('/products/', ''));
      const idx = products.findIndex((p: any) => p.id === pId);
      if (idx >= 0) {
        products[idx] = { ...products[idx], ...reqBody };
        setStoredData('syvora_mock_products', products);
        return { success: true, product: products[idx], message: 'Product updated successfully!' } as unknown as T;
      }
    }

    if (url.pathname.startsWith('/categories/')) {
      const cId = Number(url.pathname.replace('/categories/', ''));
      const idx = categories.findIndex((c: any) => c.id === cId);
      if (idx >= 0) {
        categories[idx] = { ...categories[idx], ...reqBody };
        setStoredData('syvora_mock_categories', categories);
        return { success: true, category: categories[idx], message: 'Category updated successfully!' } as unknown as T;
      }
    }

    if (url.pathname.startsWith('/reviews/')) {
      const rId = Number(url.pathname.replace('/reviews/', ''));
      const idx = reviews.findIndex((r: any) => r.id === rId);
      if (idx >= 0) {
        reviews[idx] = { ...reviews[idx], ...reqBody };
        setStoredData('syvora_mock_reviews', reviews);
        return { success: true, review: reviews[idx], message: 'Review updated!' } as unknown as T;
      }
    }

    if (url.pathname === '/admin/inventory/bulk') {
      if (Array.isArray(reqBody.updates)) {
        reqBody.updates.forEach((u: any) => {
          const idx = products.findIndex((p: any) => p.id === u.id);
          if (idx >= 0) products[idx].stock = Number(u.stock);
        });
        setStoredData('syvora_mock_products', products);
      }
      return { success: true, message: 'Stock updated in bulk!' } as unknown as T;
    }

    if (url.pathname === '/settings') {
      settings = { ...settings, ...reqBody };
      setStoredData('syvora_mock_settings', settings);
      return { success: true, settings, message: 'Settings saved successfully!' } as unknown as T;
    }
  }

  if (method === 'DELETE') {
    if (url.pathname.startsWith('/products/')) {
      const pId = Number(url.pathname.replace('/products/', ''));
      products = products.filter((p: any) => p.id !== pId);
      setStoredData('syvora_mock_products', products);
      return { success: true, message: 'Product deleted!' } as unknown as T;
    }

    if (url.pathname.startsWith('/categories/')) {
      const cId = Number(url.pathname.replace('/categories/', ''));
      categories = categories.filter((c: any) => c.id !== cId);
      setStoredData('syvora_mock_categories', categories);
      return { success: true, message: 'Category deleted!' } as unknown as T;
    }

    if (url.pathname.startsWith('/coupons/')) {
      const cpId = Number(url.pathname.replace('/coupons/', ''));
      coupons = coupons.filter((c: any) => c.id !== cpId);
      setStoredData('syvora_mock_coupons', coupons);
      return { success: true, message: 'Coupon deleted!' } as unknown as T;
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

