import db from '../config/database.js';

export function getProductReviews(req, res) {
  try {
    const { productId } = req.params;

    const stmt = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
    `);

    const reviews = stmt.all(productId);

    const statStmt = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `);
    const stats = statStmt.get(productId);

    res.json({
      success: true,
      reviews,
      stats: {
        avg_rating: stats && stats.avg_rating ? Math.round(stats.avg_rating * 10) / 10 : 5.0,
        total_reviews: stats ? stats.total_reviews : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
}

export function submitReview(req, res) {
  try {
    const { product_id, rating, comment, user_name } = req.body;
    const userId = req.user ? req.user.id : null;
    const authorName = req.user ? req.user.name : (user_name || 'Verified Buyer');

    if (!product_id || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, star rating, and comment are required.' });
    }

    // Insert review
    const stmt = db.prepare(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, comment, verified_purchase, status)
      VALUES (?, ?, ?, ?, ?, 1, 'approved')
    `);

    stmt.run(product_id, userId, authorName, parseInt(rating), comment);

    // Update product average rating & review count
    const statStmt = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = "approved"');
    const stats = statStmt.get(product_id);

    if (stats) {
      const updateProductStmt = db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?');
      updateProductStmt.run(Math.round(stats.avg_rating * 10) / 10, stats.count, product_id);
    }

    res.status(201).json({ success: true, message: 'Thank you for your review! It has been posted.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}

export function getAllReviews(req, res) {
  try {
    const stmt = db.prepare(`
      SELECT r.*, p.name as product_name, p.images as product_images
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);

    const reviews = stmt.all();
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
}

export function updateReviewStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'hidden', 'deleted'

    if (status === 'deleted') {
      db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    } else {
      db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id);
    }

    res.json({ success: true, message: 'Review status updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review.' });
  }
}
