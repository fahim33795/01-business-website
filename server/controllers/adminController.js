import db from '../config/database.js';

function parseJSON(str, fallback = {}) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function getDashboardStats(req, res) {
  try {
    // Total Sales / Gross Order Revenue (Active non-cancelled orders)
    const revenueStmt = db.prepare("SELECT COALESCE(SUM(total), 0) as total_revenue FROM orders WHERE order_status != 'Cancelled'");
    const totalRevenue = revenueStmt.get().total_revenue || 0;

    // Today's Sales Volume
    const todayStmt = db.prepare("SELECT COALESCE(SUM(total), 0) as today_sales FROM orders WHERE date(created_at) = date('now') AND order_status != 'Cancelled'");
    const todaySales = todayStmt.get().today_sales || 0;

    // Monthly Sales Volume
    const monthStmt = db.prepare("SELECT COALESCE(SUM(total), 0) as month_sales FROM orders WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') AND order_status != 'Cancelled'");
    const monthSales = monthStmt.get().month_sales || 0;

    // Total Orders (Active non-cancelled)
    const totalOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status != 'Cancelled'");
    const totalOrders = totalOrdersStmt.get().count || 0;

    // Pending Orders needing processing
    const pendingOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery')");
    const pendingOrders = pendingOrdersStmt.get().count || 0;

    // Completed / Delivered Orders
    const completedOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Delivered'");
    const completedOrders = completedOrdersStmt.get().count || 0;

    // Total Customers (Unique registered or guest customers)
    const totalCustomersStmt = db.prepare("SELECT COUNT(DISTINCT LOWER(customer_email)) as count FROM orders");
    const guestCustomerCount = totalCustomersStmt.get().count || 0;
    const registeredCustomerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count || 0;
    const totalCustomers = Math.max(guestCustomerCount, registeredCustomerCount);

    // Total Active Products
    const totalProductsStmt = db.prepare("SELECT COUNT(*) as count FROM products WHERE status != 'deleted'");
    const totalProducts = totalProductsStmt.get().count || 0;

    // Low stock products
    const lowStockStmt = db.prepare("SELECT id, name, sku, stock, low_stock_threshold FROM products WHERE stock <= low_stock_threshold AND status = 'active'");
    const lowStockProducts = lowStockStmt.all();

    // Out of stock products
    const outOfStockStmt = db.prepare("SELECT id, name, sku FROM products WHERE stock = 0 AND status = 'active'");
    const outOfStockProducts = outOfStockStmt.all();

    // Recent 10 orders with complete details
    const recentOrdersStmt = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");
    const rows = recentOrdersStmt.all();
    const recentOrders = rows.map(o => ({
      ...o,
      items: parseJSON(o.items, []),
      shipping_address: parseJSON(o.shipping_address, {})
    }));

    // Chart data: Monthly Sales for last 6 months
    const salesChartStmt = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
      FROM orders
      WHERE order_status != 'Cancelled'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);
    const salesChartData = salesChartStmt.all().reverse();

    res.json({
      success: true,
      stats: {
        totalRevenue,
        todaySales,
        monthSales,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        lowStockProducts,
        outOfStockProducts,
        recentOrders,
        salesChartData
      }
    });
  } catch (error) {
    console.error('Error in admin stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
}

export function getCustomers(req, res) {
  try {
    const registeredUsers = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.addresses, u.created_at,
             COUNT(CASE WHEN o.order_status != 'Cancelled' THEN o.id END) as total_orders,
             COALESCE(SUM(CASE WHEN o.order_status != 'Cancelled' THEN o.total ELSE 0 END), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
    `).all();

    const guestOrders = db.prepare(`
      SELECT o.customer_email as email,
             o.customer_name as name,
             o.customer_phone as phone,
             o.shipping_address as addresses,
             COUNT(CASE WHEN o.order_status != 'Cancelled' THEN o.id END) as total_orders,
             COALESCE(SUM(CASE WHEN o.order_status != 'Cancelled' THEN o.total ELSE 0 END), 0) as total_spent,
             MIN(o.created_at) as created_at
      FROM orders o
      WHERE o.user_id IS NULL OR o.user_id NOT IN (SELECT id FROM users)
      GROUP BY LOWER(o.customer_email)
    `).all();

    const customerMap = new Map();

    registeredUsers.forEach(u => {
      let parsedAddr = [];
      try { parsedAddr = JSON.parse(u.addresses); } catch (e) {}
      customerMap.set(u.email.toLowerCase(), {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        addresses: parsedAddr,
        total_orders: u.total_orders || 0,
        total_spent: u.total_spent || 0,
        type: 'Registered Member',
        created_at: u.created_at
      });
    });

    guestOrders.forEach(g => {
      const emailKey = g.email.toLowerCase();
      let parsedAddr = {};
      try { parsedAddr = JSON.parse(g.addresses); } catch (e) {}

      if (!customerMap.has(emailKey)) {
        customerMap.set(emailKey, {
          id: `guest_${emailKey}`,
          name: g.name,
          email: g.email,
          phone: g.phone || 'N/A',
          addresses: [parsedAddr],
          total_orders: g.total_orders || 0,
          total_spent: g.total_spent || 0,
          type: 'Guest Customer',
          created_at: g.created_at
        });
      } else {
        // Merge guest spend into registered user if email matches
        const existing = customerMap.get(emailKey);
        existing.total_orders += g.total_orders;
        existing.total_spent += g.total_spent;
      }
    });

    const customers = Array.from(customerMap.values());
    res.json({ success: true, customers });
  } catch (error) {
    console.error('Error in getCustomers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers.' });
  }
}

export function getInventory(req, res) {
  try {
    const stmt = db.prepare(`
      SELECT p.id, p.name, p.sku, p.brand, p.price, p.sale_price, p.stock, p.low_stock_threshold, p.status, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status != 'deleted'
      ORDER BY p.stock ASC
    `);

    const inventory = stmt.all();
    res.json({ success: true, inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
  }
}

export function updateStockBulk(req, res) {
  try {
    const { updates } = req.body; // Array of { id, stock }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates array is required.' });
    }

    const stmt = db.prepare('UPDATE products SET stock = ? WHERE id = ?');
    for (const update of updates) {
      stmt.run(parseInt(update.stock), update.id);
    }

    res.json({ success: true, message: 'Inventory updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update stock.' });
  }
}
