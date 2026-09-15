import bcrypt from 'bcryptjs';
import db, { initDatabase } from './config/database.js';

export function seedData() {
  console.log('🌱 Initializing database tables...');
  initDatabase();

  console.log('🌱 Checking seed data...');

  // 1. Seed Admin & Demo Users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('👤 Seeding default users...');
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('12345', salt);
    const customerPasswordHash = bcrypt.hashSync('password123', salt);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone, addresses)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('Syvora Administrator', 'admin@syvora.com', adminPasswordHash, 'admin', '+1 (800) 555-7986', '[]');
    insertUser.run(
      'Sophia Thorne',
      'sophia@example.com',
      customerPasswordHash,
      'customer',
      '+1 (415) 889-1234',
      JSON.stringify([
        {
          id: 1,
          name: 'Sophia Thorne',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          area: 'Pacific Heights',
          postal_code: '94115',
          full_address: '2450 Clay Street, Suite 4B',
          is_default: true
        }
      ])
    );
  }

  // 2. Seed Categories
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoryCount === 0) {
    console.log('🏷️ Seeding categories...');
    const categories = [
      { name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', description: 'Nourishing cleansers, radiant serums, and botanical moisturizers for luminous skin.' },
      { name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', description: 'Ultra-pigmented lips, velvet foundations, and luminous cheek balms.' },
      { name: 'Haircare', slug: 'haircare', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80', description: 'Silk infusion hair oils, restorative masks, and scalp elixir treatments.' },
      { name: 'Body Care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80', description: 'Velvet soufflé lotions, exfoliating sea salt scrubs, and hydrating shower oils.' },
      { name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80', description: 'Artisanal Eau de Parfums and delicate hair & body mists.' },
      { name: 'Beauty Tools', slug: 'beauty-tools', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', description: 'Rose quartz gua sha sculptors, sonic facial cleansers, and silk pillowcases.' },
      { name: 'Wellness', slug: 'wellness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', description: 'Botanical beauty elixirs, stress-relief bath salts, and collagen boosters.' },
      { name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80', description: 'Scented soy candles, linen diffusers, and luxury silk eye sleep masks.' }
    ];

    const insertCat = db.prepare("INSERT INTO categories (name, slug, image, description, status) VALUES (?, ?, ?, ?, 'active')");
    categories.forEach(c => insertCat.run(c.name, c.slug, c.image, c.description));
  }

  // 3. Seed Products
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    console.log('💄 Seeding luxury products...');
    const catMap = {};
    const catRows = db.prepare('SELECT id, slug FROM categories').all();
    catRows.forEach(c => { catMap[c.slug] = c.id; });

    const products = [
      {
        name: 'Syvora Radiant Glow Hyaluronic Serum',
        slug: 'syvora-radiant-glow-hyaluronic-serum',
        sku: 'SYV-SKIN-001',
        brand: 'Syvora Beauty',
        category_id: catMap['skincare'],
        description: 'An ultra-hydrating serum infused with multi-molecular weight Hyaluronic Acid, Niacinamide, and Rose Damascena extract to instantly plump skin and restore natural luminosity.',
        short_description: 'Instant plumping serum for dewy, luminous skin.',
        price: 1850.00,
        sale_price: 1450.00,
        cost_price: 600.00,
        stock: 45,
        low_stock_threshold: 10,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
          'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80',
          'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: 'Full Size', price: 1450.00, size: '30ml / 1.0 fl oz' },
          { name: 'Travel Size', price: 750.00, size: '15ml / 0.5 fl oz' }
        ]),
        ingredients: 'Aqua/Water, Hyaluronic Acid (Multi-Depth), Niacinamide 5%, Organic Rose Hydrosol, Panthenol (Pro-Vitamin B5), Sodium PCA, Glycerin, Phenoxyethanol.',
        benefits: '• Plumps fine lines in 15 minutes\n• Deeply hydrates for up to 72 hours\n• Brightens dull skin tone\n• Non-comedogenic and fragrance-free',
        how_to_use: 'Apply 3-4 drops to cleansed, slightly damp face and neck morning and evening. Follow with Syvora Velvet Moisture Cream.',
        tags: JSON.stringify(['serum', 'hyaluronic', 'glowing skin', 'best seller']),
        featured: 1,
        best_seller: 1,
        new_arrival: 0,
        rating: 4.9,
        review_count: 128
      },
      {
        name: 'Syvora Silk Touch Botanical Face Oil',
        slug: 'syvora-silk-touch-botanical-face-oil',
        sku: 'SYV-SKIN-002',
        brand: 'Syvora Beauty',
        category_id: catMap['skincare'],
        description: 'A weightless elixir blending Cold-Pressed Marula, Rosehip Seed, and Squalane to lock in moisture and nourish skin overnight without clogging pores.',
        short_description: 'Luxury nourishing night oil for silky soft complexion.',
        price: 2200.00,
        sale_price: null,
        cost_price: 800.00,
        stock: 25,
        low_stock_threshold: 5,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80',
          'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: '30ml Bottle', price: 2200.00, size: '30ml' }
        ]),
        ingredients: 'Squalane, Sclerocarya Birrea (Marula) Seed Oil, Rosa Canina (Rosehip) Fruit Oil, Tocopherol (Vitamin E), Frankincense Essential Oil.',
        benefits: '• Deeply restores skin barrier\n• Imparts healthy golden glow\n• Non-greasy dry oil texture',
        how_to_use: 'Warm 2 drops in hands and gently press into face after moisturizer as final step.',
        tags: JSON.stringify(['face oil', 'marula', 'night oil', 'anti-aging']),
        featured: 1,
        best_seller: 0,
        new_arrival: 1,
        rating: 4.8,
        review_count: 64
      },
      {
        name: 'Velvet Matte Liquid Lipstick - Rose Champagne',
        slug: 'velvet-matte-liquid-lipstick-rose-champagne',
        sku: 'SYV-MAKE-001',
        brand: 'Syvora Cosmetics',
        category_id: catMap['makeup'],
        description: 'A luxurious, transfer-proof liquid lipstick with a featherlight velvet feel. Infused with Vitamin E and Jojoba Oil for all-day comfort without drying lips.',
        short_description: 'Transfer-proof velvet liquid lipstick in flattering rose nude.',
        price: 850.00,
        sale_price: 650.00,
        cost_price: 250.00,
        stock: 60,
        low_stock_threshold: 15,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: 'Rose Champagne (Nude)', shade: '#D4A373' },
          { name: 'Velvet Berry (Deep Plum)', shade: '#800020' },
          { name: 'Syvora Red (Classic Scarlet)', shade: '#C8102E' }
        ]),
        ingredients: 'Isododecane, Dimethicone, Jojoba Oil, Tocopheryl Acetate, Silica Dimethyl Silylate, Red 7 Lake, Iron Oxides.',
        benefits: '• 16-hour longwear formula\n• Hydrating velvet-matte finish\n• Smudge-proof and kiss-proof',
        how_to_use: 'Define lips with precision applicator tip, then fill in center with smooth strokes.',
        tags: JSON.stringify(['lipstick', 'matte', 'makeup', 'best seller']),
        featured: 0,
        best_seller: 1,
        new_arrival: 0,
        rating: 5.0,
        review_count: 210
      },
      {
        name: 'Luminous Glow Cream Blush Balm',
        slug: 'luminous-glow-cream-blush-balm',
        sku: 'SYV-MAKE-002',
        brand: 'Syvora Cosmetics',
        category_id: catMap['makeup'],
        description: 'A melt-in cream blush balm that imparts a youthful, lit-from-within flush to cheeks and lips with a dewy, glass-skin finish.',
        short_description: 'Dewy cream blush for natural flushed cheeks.',
        price: 750.00,
        sale_price: null,
        cost_price: 220.00,
        stock: 35,
        low_stock_threshold: 8,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: 'Peachy Glow', shade: '#E07A5F' },
          { name: 'Soft Blush', shade: '#F5E6E8' }
        ]),
        ingredients: 'Caprylic/Capric Triglyceride, Candelilla Wax, Shea Butter, Mica, Titanium Dioxide, Rosehip Seed Oil.',
        benefits: '• Melt-on dewiness\n• Buildable flush\n• Multi-use for cheeks and lips',
        how_to_use: 'Tap onto apples of cheeks using fingertips or beauty sponge and blend upward.',
        tags: JSON.stringify(['blush', 'cream blush', 'dewy']),
        featured: 1,
        best_seller: 0,
        new_arrival: 1,
        rating: 4.7,
        review_count: 42
      },
      {
        name: 'Syvora Silk Repair Hair Elixir Oil',
        slug: 'syvora-silk-repair-hair-elixir-oil',
        sku: 'SYV-HAIR-001',
        brand: 'Syvora Hair Care',
        category_id: catMap['haircare'],
        description: 'A light-as-air finishing oil infused with Argan, Camellia, and Keratin amino acids to seal split ends, tame flyaways, and boost shine by 300%.',
        short_description: 'Restorative hair oil for glossy, frizz-free locks.',
        price: 1250.00,
        sale_price: 950.00,
        cost_price: 400.00,
        stock: 50,
        low_stock_threshold: 10,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
          'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: '100ml / 3.4 oz', price: 950.00 }
        ]),
        ingredients: 'Cyclopentasiloxane, Argania Spinosa Kernel (Argan) Oil, Camellia Japonica Seed Oil, Hydrolyzed Keratin, Tocopherol.',
        benefits: '• Heat protection up to 450°F\n• Instant mirror-like glass shine\n• Reduces breakage by 92%',
        how_to_use: 'Apply 1-2 pumps onto damp hair before blow-drying or smooth through dry ends.',
        tags: JSON.stringify(['hair oil', 'argan', 'haircare', 'shine']),
        featured: 1,
        best_seller: 1,
        new_arrival: 0,
        rating: 4.9,
        review_count: 88
      },
      {
        name: 'Luxe Rose Quartz Gua Sha & Roller Set',
        slug: 'luxe-rose-quartz-gua-sha-roller-set',
        sku: 'SYV-TOOL-001',
        brand: 'Syvora Tools',
        category_id: catMap['beauty-tools'],
        description: 'Hand-carved 100% natural Grade-A Rose Quartz beauty sculpting set designed to relieve facial tension, drain lymphatic fluid, and define cheekbones.',
        short_description: 'Natural rose quartz facial contouring tool set.',
        price: 1150.00,
        sale_price: 950.00,
        cost_price: 350.00,
        stock: 30,
        low_stock_threshold: 5,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: 'Rose Quartz Set', color: 'Pink Rose' },
          { name: 'Jade Green Set', color: 'Emerald' }
        ]),
        ingredients: '100% Authentic Natural Brazilian Rose Quartz, Zinc Alloy frame.',
        benefits: '• Relieves jaw and facial muscle tightness\n• Enhances absorption of serums\n• Reduces puffiness',
        how_to_use: 'Apply Syvora Face Oil, then scrape Gua Sha upward along jawline, cheekbones, and forehead.',
        tags: JSON.stringify(['gua sha', 'roller', 'beauty tool', 'rose quartz']),
        featured: 0,
        best_seller: 1,
        new_arrival: 0,
        rating: 4.8,
        review_count: 145
      },
      {
        name: 'Maison Syvora Eau de Parfum - Golden Amber & Vanilla',
        slug: 'maison-syvora-eau-de-parfum-golden-amber-vanilla',
        sku: 'SYV-FRAG-001',
        brand: 'Maison Syvora',
        category_id: catMap['fragrance'],
        description: 'An intoxicating gourmand floral fragrance opening with luminous Bergamot and Warm Pear, settling into a velvet heart of Jasmine Sambac, Madagascar Vanilla, and Golden Amber.',
        short_description: 'Captivating sensual fragrance of Amber, Jasmine & Vanilla.',
        price: 3200.00,
        sale_price: null,
        cost_price: 1000.00,
        stock: 20,
        low_stock_threshold: 4,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: '50ml / 1.7 fl oz', price: 3200.00 },
          { name: '100ml / 3.4 fl oz', price: 4800.00 }
        ]),
        ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, Coumarin, Limonene.',
        benefits: '• Long-lasting 12-hour sillage\n• Artisanal French bottle design\n• Hypoallergenic formula',
        how_to_use: 'Spray on pulse points: wrists, collarbone, behind ears, and knees.',
        tags: JSON.stringify(['perfume', 'fragrance', 'vanilla', 'luxury']),
        featured: 1,
        best_seller: 0,
        new_arrival: 1,
        rating: 5.0,
        review_count: 56
      },
      {
        name: 'Syvora Whipped Cashmere Body Soufflé',
        slug: 'syvora-whipped-cashmere-body-souffle',
        sku: 'SYV-BODY-001',
        brand: 'Syvora Body',
        category_id: catMap['body-care'],
        description: 'An ultra-rich whipped body cream infused with Raw Shea Butter, Cocoa Butter, and Squalane that melts instantly into dry skin for 24-hour velvety softness.',
        short_description: 'Decadent whipped body butter with cashmere scent.',
        price: 1150.00,
        sale_price: 950.00,
        cost_price: 350.00,
        stock: 40,
        low_stock_threshold: 8,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1608248597369-1833589b33a7?w=800&q=80',
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
        ]),
        variants: JSON.stringify([
          { name: '250g Jar', price: 950.00 }
        ]),
        ingredients: 'Butyrospermum Parkii (Shea) Butter, Theobroma Cacao (Cocoa) Seed Butter, Coconut Oil, Almond Oil, Vanilla Extract.',
        benefits: '• Non-greasy rapid absorption\n• Heals cracked elbows & knees\n• Subtle warm cashmere scent',
        how_to_use: 'Massage generously all over body after shower while skin is slightly warm.',
        tags: JSON.stringify(['body butter', 'shea butter', 'cashmere', 'body care']),
        featured: 0,
        best_seller: 1,
        new_arrival: 0,
        rating: 4.9,
        review_count: 178
      }
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (
        name, slug, sku, brand, category_id, description, short_description,
        price, sale_price, cost_price, stock, low_stock_threshold,
        images, variants, ingredients, benefits, how_to_use, tags,
        featured, best_seller, new_arrival, status, rating, review_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `);

    products.forEach(p => {
      insertProd.run(
        p.name, p.slug, p.sku, p.brand, p.category_id, p.description, p.short_description,
        p.price, p.sale_price, p.cost_price, p.stock, p.low_stock_threshold,
        p.images, p.variants, p.ingredients, p.benefits, p.how_to_use, p.tags,
        p.featured, p.best_seller, p.new_arrival, p.rating, p.review_count
      );
    });
  }

  // 4. Seed Coupons
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get().count;
  if (couponCount === 0) {
    console.log('🎟️ Seeding default coupons...');
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_spend, max_discount, usage_limit, used_count, status)
      VALUES (?, ?, ?, ?, ?, ?, 0, 'active')
    `);

    insertCoupon.run('WELCOME10', 'percent', 10, 0, 500, 500);
    insertCoupon.run('GLOW20', 'percent', 20, 1000, 1000, 200);
    insertCoupon.run('SYVORA50', 'fixed', 500, 2000, 500, 100);
  }

  // 5. Seed Reviews
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (reviewCount === 0) {
    console.log('⭐ Seeding customer reviews...');
    const firstProd = db.prepare('SELECT id FROM products ORDER BY id ASC LIMIT 1').get();
    if (firstProd) {
      const insertReview = db.prepare(`
        INSERT INTO reviews (product_id, user_name, rating, comment, verified_purchase, status)
        VALUES (?, ?, ?, ?, ?, 'approved')
      `);

      insertReview.run(firstProd.id, 'Amelia Vance', 5, 'My skin has literally never felt so plump and glowing! The hyaluronic acid absorbs instantly without any sticky residue.', 1);
      insertReview.run(firstProd.id, 'Elena Rostova', 5, 'Obsessed with the packaging and performance. Worth every single penny!', 1);
    }
  }

  console.log('✅ Database successfully seeded and ready!');
}

seedData();

