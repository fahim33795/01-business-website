import db from '../config/database.js';

function parseJSON(str, fallback = []) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function getProducts(req, res) {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      onSale,
      featured,
      bestSeller,
      newArrival,
      sortBy = 'featured',
      page = 1,
      limit = 12
    } = req.query;

    let conditions = ["p.status = 'active'"];
    let params = [];

    if (search) {
      conditions.push("(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR p.sku LIKE ? OR c.name LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    if (category) {
      conditions.push("(c.slug = ? OR c.name = ? OR p.category_id = ?)");
      params.push(category, category, parseInt(category) || 0);
    }

    if (brand) {
      conditions.push("p.brand = ?");
      params.push(brand);
    }

    if (minPrice) {
      conditions.push("COALESCE(p.sale_price, p.price) >= ?");
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push("COALESCE(p.sale_price, p.price) <= ?");
      params.push(parseFloat(maxPrice));
    }

    if (rating) {
      conditions.push("p.rating >= ?");
      params.push(parseFloat(rating));
    }

    if (inStock === 'true') {
      conditions.push("p.stock > 0");
    }

    if (onSale === 'true') {
      conditions.push("p.sale_price IS NOT NULL AND p.sale_price < p.price");
    }

    if (featured === 'true') {
      conditions.push("p.featured = 1");
    }

    if (bestSeller === 'true') {
      conditions.push("p.best_seller = 1");
    }

    if (newArrival === 'true') {
      conditions.push("p.new_arrival = 1");
    }

    let orderBy = 'p.featured DESC, p.created_at DESC';
    if (sortBy === 'newest') orderBy = 'p.created_at DESC';
    if (sortBy === 'price-asc') orderBy = 'COALESCE(p.sale_price, p.price) ASC';
    if (sortBy === 'price-desc') orderBy = 'COALESCE(p.sale_price, p.price) DESC';
    if (sortBy === 'rating') orderBy = 'p.rating DESC, p.review_count DESC';
    if (sortBy === 'bestseller') orderBy = 'p.best_seller DESC, p.review_count DESC';

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countStmt = db.prepare(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `);
    const countResult = countStmt.get(...params);
    const total = countResult ? countResult.total : 0;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 12;
    const offset = (parsedPage - 1) * parsedLimit;

    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const stmt = db.prepare(query);
    const rows = stmt.all(...params, parsedLimit, offset);

    const products = rows.map(p => ({
      ...p,
      images: parseJSON(p.images, []),
      variants: parseJSON(p.variants, []),
      tags: parseJSON(p.tags, []),
      featured: Boolean(p.featured),
      best_seller: Boolean(p.best_seller),
      new_arrival: Boolean(p.new_arrival),
      discount_percent: p.sale_price && p.price > p.sale_price 
        ? Math.round(((p.price - p.sale_price) / p.price) * 100) 
        : 0
    }));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
}

export function getProductBySlugOrId(req, res) {
  try {
    const { identifier } = req.params;

    const stmt = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? OR p.id = ?
    `);

    const p = stmt.get(identifier, parseInt(identifier) || 0);

    if (!p) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get related products from same category
    const relatedStmt = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      ORDER BY p.rating DESC
      LIMIT 4
    `);

    const relatedRows = relatedStmt.all(p.category_id, p.id);
    const related = relatedRows.map(rel => ({
      ...rel,
      images: parseJSON(rel.images, []),
      variants: parseJSON(rel.variants, []),
      discount_percent: rel.sale_price && rel.price > rel.sale_price 
        ? Math.round(((rel.price - rel.sale_price) / rel.price) * 100) 
        : 0
    }));

    const product = {
      ...p,
      images: parseJSON(p.images, []),
      variants: parseJSON(p.variants, []),
      tags: parseJSON(p.tags, []),
      featured: Boolean(p.featured),
      best_seller: Boolean(p.best_seller),
      new_arrival: Boolean(p.new_arrival),
      discount_percent: p.sale_price && p.price > p.sale_price 
        ? Math.round(((p.price - p.sale_price) / p.price) * 100) 
        : 0,
      related
    };

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
}

export function getSearchSuggestions(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    const term = `%${q.trim()}%`;
    const stmt = db.prepare(`
      SELECT p.id, p.name, p.slug, p.brand, p.price, p.sale_price, p.images, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.brand LIKE ? OR c.name LIKE ?) AND p.status = 'active'
      LIMIT 6
    `);

    const rows = stmt.all(term, term, term);
    const suggestions = rows.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      brand: r.brand,
      price: r.price,
      sale_price: r.sale_price,
      category_name: r.category_name,
      image: parseJSON(r.images, [''])[0] || ''
    }));

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed.' });
  }
}

export function createProduct(req, res) {
  try {
    const {
      name,
      sku,
      brand = 'Syvora',
      category_id,
      description,
      short_description,
      price,
      sale_price,
      cost_price,
      stock = 10,
      low_stock_threshold = 5,
      images = [],
      variants = [],
      ingredients,
      benefits,
      how_to_use,
      tags = [],
      featured = false,
      best_seller = false,
      new_arrival = false,
      status = 'active'
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const generatedSku = sku || 'SYV-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const stmt = db.prepare(`
      INSERT INTO products (
        name, slug, sku, brand, category_id, description, short_description,
        price, sale_price, cost_price, stock, low_stock_threshold,
        images, variants, ingredients, benefits, how_to_use, tags,
        featured, best_seller, new_arrival, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      name,
      generatedSlug,
      generatedSku,
      brand,
      category_id || null,
      description || '',
      short_description || '',
      parseFloat(price),
      sale_price ? parseFloat(sale_price) : null,
      cost_price ? parseFloat(cost_price) : null,
      parseInt(stock) || 0,
      parseInt(low_stock_threshold) || 5,
      JSON.stringify(Array.isArray(images) ? images : [images]),
      JSON.stringify(Array.isArray(variants) ? variants : []),
      ingredients || '',
      benefits || '',
      how_to_use || '',
      JSON.stringify(Array.isArray(tags) ? tags : []),
      featured ? 1 : 0,
      best_seller ? 1 : 0,
      new_arrival ? 1 : 0,
      status
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      productId: info.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

export function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const existing = existingStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const name = data.name !== undefined ? data.name : existing.name;
    const price = data.price !== undefined ? parseFloat(data.price) : existing.price;
    const sale_price = data.sale_price !== undefined ? (data.sale_price ? parseFloat(data.sale_price) : null) : existing.sale_price;
    const stock = data.stock !== undefined ? parseInt(data.stock) : existing.stock;
    const category_id = data.category_id !== undefined ? (data.category_id ? parseInt(data.category_id) : null) : existing.category_id;
    const brand = data.brand !== undefined ? data.brand : existing.brand;
    const description = data.description !== undefined ? data.description : existing.description;
    const short_description = data.short_description !== undefined ? data.short_description : existing.short_description;
    const images = data.images !== undefined ? JSON.stringify(data.images) : existing.images;
    const variants = data.variants !== undefined ? JSON.stringify(data.variants) : existing.variants;
    const ingredients = data.ingredients !== undefined ? data.ingredients : existing.ingredients;
    const benefits = data.benefits !== undefined ? data.benefits : existing.benefits;
    const how_to_use = data.how_to_use !== undefined ? data.how_to_use : existing.how_to_use;
    const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured;
    const best_seller = data.best_seller !== undefined ? (data.best_seller ? 1 : 0) : existing.best_seller;
    const new_arrival = data.new_arrival !== undefined ? (data.new_arrival ? 1 : 0) : existing.new_arrival;
    const status = data.status !== undefined ? data.status : existing.status;

    const stmt = db.prepare(`
      UPDATE products
      SET name = ?, price = ?, sale_price = ?, stock = ?, category_id = ?, brand = ?,
          description = ?, short_description = ?, images = ?, variants = ?,
          ingredients = ?, benefits = ?, how_to_use = ?, featured = ?,
          best_seller = ?, new_arrival = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name, price, sale_price, stock, category_id, brand,
      description, short_description, images, variants,
      ingredients, benefits, how_to_use, featured,
      best_seller, new_arrival, status, id
    );

    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

export function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const stmt = db.prepare('UPDATE products SET status = "deleted" WHERE id = ?');
    stmt.run(id);

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}
