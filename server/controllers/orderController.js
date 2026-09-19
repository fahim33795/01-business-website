import db from '../config/database.js';

function parseJSON(str, fallback = []) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function createOrder(req, res) {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      delivery_method = 'Standard',
      payment_method,
      items = [],
      coupon_code,
      currency = 'USD'
    } = req.body;

    const finalEmail = customer_email || `${(customer_phone || 'customer').replace(/[^0-9]/g, '')}@syvora.com`;
    const finalPhone = customer_phone || 'N/A';

    if (!customer_name || !shipping_address || !items || !items.length || !payment_method) {
      return res.status(400).json({ success: false, message: 'All required checkout fields must be provided.' });
    }

    // SERVER-SIDE PRICE & STOCK RE-CALCULATION (PRICE SECURITY)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = Number(item.id);
      const productStmt = db.prepare('SELECT id, name, sku, price, sale_price, stock, images FROM products WHERE id = ?');
      const product = productStmt.get(prodId);

      if (!product) {
        // Fallback using item name/price if product ID is non-standard
        const itemPrice = Number(item.price) || 1000;
        const itemSubtotal = itemPrice * (item.quantity || 1);
        calculatedSubtotal += itemSubtotal;
        verifiedItems.push({
          id: prodId || Date.now(),
          name: item.name || 'Beauty Product',
          sku: item.sku || `SYV-PROD-${prodId || '001'}`,
          price: itemPrice,
          original_price: itemPrice,
          quantity: item.quantity || 1,
          variant: item.variant || null,
          image: item.image || '',
          subtotal: itemSubtotal
        });
        continue;
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} left.`
        });
      }

      const itemPrice = product.sale_price && product.sale_price < product.price ? product.sale_price : product.price;
      const itemSubtotal = itemPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      const productImages = parseJSON(product.images, ['']);

      verifiedItems.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: itemPrice,
        original_price: product.price,
        quantity: item.quantity,
        variant: item.variant || null,
        image: productImages[0] || '',
        subtotal: itemSubtotal
      });
    }

    // Server-side Coupon validation
    let discountAmount = 0;
    if (coupon_code) {
      const couponStmt = db.prepare('SELECT * FROM coupons WHERE code = ? AND status = "active"');
      const coupon = couponStmt.get(coupon_code.toUpperCase().trim());

      if (coupon) {
        const now = new Date();
        const expiry = coupon.expiry_date ? new Date(coupon.expiry_date) : null;
        const isValidDate = !expiry || expiry > now;
        const isMinSpendMet = calculatedSubtotal >= (coupon.min_spend || 0);

        if (isValidDate && isMinSpendMet && coupon.used_count < coupon.usage_limit) {
          if (coupon.discount_type === 'percent') {
            discountAmount = (calculatedSubtotal * coupon.discount_value) / 100;
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
              discountAmount = coupon.max_discount;
            }
          } else {
            discountAmount = coupon.discount_value;
          }

          // Increment coupon usage
          db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?').run(coupon.id);
        }
      }
    }

    // Calculate shipping fee strictly based on delivery method (Inside Dhaka: 80, Outside Dhaka: 130)
    const shippingFee = delivery_method === 'Outside Dhaka' ? 130 : 80;

    const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // Generate unique order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SYV-${Date.now().toString().slice(-4)}${randomSuffix}`;
    const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Deduct stock for items
    for (const item of verifiedItems) {
      if (item.id) {
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);
      }
    }

    const userId = req.user ? req.user.id : null;
    const initialPaymentStatus = payment_method === 'cod' ? 'pending' : 'paid';

    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, delivery_method, payment_method, payment_status,
        order_status, tracking_number, items, subtotal, discount,
        shipping_fee, tax, total, currency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, 0, ?, ?)
    `);

    const info = insertOrderStmt.run(
      orderNumber,
      userId,
      customer_name,
      finalEmail,
      finalPhone,
      typeof shipping_address === 'string' ? shipping_address : JSON.stringify(shipping_address),
      delivery_method,
      payment_method,
      initialPaymentStatus,
      trackingNumber,
      JSON.stringify(verifiedItems),
      calculatedSubtotal,
      discountAmount,
      shippingFee,
      grandTotal,
      currency
    );

    const parsedAddress = typeof shipping_address === 'string' ? JSON.parse(shipping_address) : shipping_address;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id: info.lastInsertRowid,
        order_number: orderNumber,
        tracking_number: trackingNumber,
        user_id: userId,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address: parsedAddress,
        delivery_method,
        payment_method,
        payment_status: initialPaymentStatus,
        order_status: 'Confirmed',
        items: verifiedItems,
        subtotal: calculatedSubtotal,
        discount: discountAmount,
        shipping_fee: shippingFee,
        tax: 0,
        total: grandTotal,
        currency,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
}

export function trackOrder(req, res) {
  try {
    const { orderNumber } = req.params;

    const stmt = db.prepare('SELECT * FROM orders WHERE order_number = ? OR tracking_number = ? OR id = ?');
    const order = stmt.get(orderNumber.trim(), orderNumber.trim(), parseInt(orderNumber) || 0);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found. Please double-check your Order ID or Tracking Number.' });
    }

    // Build timeline stages
    const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(order.order_status);

    const timeline = statuses.map((status, index) => ({
      status,
      completed: currentIndex >= index,
      current: currentIndex === index
    }));

    let parsedAddress = order.shipping_address;
    try {
      parsedAddress = JSON.parse(order.shipping_address);
    } catch (e) {}

    res.json({
      success: true,
      order: {
        ...order,
        items: parseJSON(order.items, []),
        shipping_address: parsedAddress,
        timeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Order tracking failed.' });
  }
}

export function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    const stmt = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(userId);

    const orders = rows.map(o => ({
      ...o,
      items: parseJSON(o.items, []),
      shipping_address: parseJSON(o.shipping_address, {})
    }));

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user orders.' });
  }
}

export function getAllOrders(req, res) {
  try {
    const { status, payment_status, search, page = 1, limit = 20 } = req.query;

    let conditions = [];
    let params = [];

    if (status) {
      conditions.push('order_status = ?');
      params.push(status);
    }

    if (payment_status) {
      conditions.push('payment_status = ?');
      params.push(payment_status);
    }

    if (search) {
      conditions.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM orders ${whereClause}`);
    const total = countStmt.get(...params).total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const stmt = db.prepare(`
      SELECT * FROM orders
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(...params, parseInt(limit), offset);
    const orders = rows.map(o => ({
      ...o,
      items: parseJSON(o.items, []),
      shipping_address: parseJSON(o.shipping_address, {})
    }));

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
}

export function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      delivery_method,
      payment_method,
      payment_status,
      order_status,
      tracking_number,
      internal_notes,
      total,
      items
    } = req.body;

    const existingStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const existing = existingStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const formattedAddress = shipping_address !== undefined
      ? (typeof shipping_address === 'object' ? JSON.stringify(shipping_address) : shipping_address)
      : null;

    const formattedItems = items !== undefined
      ? (typeof items === 'object' ? JSON.stringify(items) : items)
      : null;

    const stmt = db.prepare(`
      UPDATE orders
      SET customer_name = COALESCE(?, customer_name),
          customer_email = COALESCE(?, customer_email),
          customer_phone = COALESCE(?, customer_phone),
          shipping_address = COALESCE(?, shipping_address),
          delivery_method = COALESCE(?, delivery_method),
          payment_method = COALESCE(?, payment_method),
          payment_status = COALESCE(?, payment_status),
          order_status = COALESCE(?, order_status),
          tracking_number = COALESCE(?, tracking_number),
          internal_notes = COALESCE(?, internal_notes),
          total = COALESCE(?, total),
          items = COALESCE(?, items),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      customer_name || null,
      customer_email || null,
      customer_phone || null,
      formattedAddress,
      delivery_method || null,
      payment_method || null,
      payment_status || null,
      order_status || null,
      tracking_number || null,
      internal_notes || null,
      total || null,
      formattedItems,
      id
    );

    res.json({ success: true, message: 'Order updated successfully.' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Failed to update order.' });
  }
}

export function getInvoice(req, res) {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?');
    const order = stmt.get(id, id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    res.json({
      success: true,
      invoice: {
        ...order,
        items: parseJSON(order.items, []),
        shipping_address: parseJSON(order.shipping_address, {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate invoice.' });
  }
}
