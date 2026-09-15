import db from '../config/database.js';

export function validateCoupon(req, res) {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const stmt = db.prepare('SELECT * FROM coupons WHERE code = ? AND status = "active"');
    const coupon = stmt.get(code.toUpperCase().trim());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code.' });
    }

    const now = new Date();
    if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached.' });
    }

    const cartSubtotal = parseFloat(subtotal) || 0;
    if (cartSubtotal < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `Minimum spend of $${coupon.min_spend} required for this coupon.`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = (cartSubtotal * coupon.discount_value) / 100;
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discountAmount: Math.round(discountAmount * 100) / 100
      },
      message: `Coupon "${coupon.code}" applied successfully!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to validate coupon.' });
  }
}

export function getCoupons(req, res) {
  try {
    const stmt = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC');
    const coupons = stmt.all();
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons.' });
  }
}

export function createCoupon(req, res) {
  try {
    const { code, discount_type, discount_value, min_spend, max_discount, usage_limit, expiry_date, status = 'active' } = req.body;

    if (!code || !discount_type || discount_value === undefined) {
      return res.status(400).json({ success: false, message: 'Code, discount type, and value are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_spend, max_discount, usage_limit, expiry_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      code.toUpperCase().trim(),
      discount_type,
      parseFloat(discount_value),
      min_spend ? parseFloat(min_spend) : 0,
      max_discount ? parseFloat(max_discount) : null,
      usage_limit ? parseInt(usage_limit) : 100,
      expiry_date || null,
      status
    );

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully.',
      couponId: info.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create coupon.' });
  }
}

export function deleteCoupon(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
    res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon.' });
  }
}
