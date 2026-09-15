import express from 'express';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as orderController from '../controllers/orderController.js';
import * as couponController from '../controllers/couponController.js';
import * as reviewController from '../controllers/reviewController.js';
import * as adminController from '../controllers/adminController.js';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

// --- Health Check ---
router.get('/health', (req, res) => {
  res.json({ status: 'online', brand: 'Syvora Beauty & Lifestyle', timestamp: new Date().toISOString() });
});

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);
router.put('/auth/profile', authenticateToken, authController.updateProfile);
router.put('/auth/change-password', authenticateToken, authController.changePassword);

// --- Product Routes ---
router.get('/products', productController.getProducts);
router.get('/products/search/suggestions', productController.getSearchSuggestions);
router.get('/products/:identifier', productController.getProductBySlugOrId);
router.post('/products', requireAdmin, productController.createProduct);
router.put('/products/:id', requireAdmin, productController.updateProduct);
router.delete('/products/:id', requireAdmin, productController.deleteProduct);

// --- Category Routes ---
router.get('/categories', categoryController.getCategories);
router.post('/categories', requireAdmin, categoryController.createCategory);
router.put('/categories/:id', requireAdmin, categoryController.updateCategory);
router.delete('/categories/:id', requireAdmin, categoryController.deleteCategory);

// --- Order Routes ---
router.post('/orders', optionalAuth, orderController.createOrder);
router.get('/orders/track/:orderNumber', orderController.trackOrder);
router.get('/orders/my-orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/invoice/:id', orderController.getInvoice);
router.get('/orders', requireAdmin, orderController.getAllOrders);
router.put('/orders/:id', requireAdmin, orderController.updateOrderStatus);

// --- Coupon Routes ---
router.post('/coupons/validate', couponController.validateCoupon);
router.get('/coupons', requireAdmin, couponController.getCoupons);
router.post('/coupons', requireAdmin, couponController.createCoupon);
router.delete('/coupons/:id', requireAdmin, couponController.deleteCoupon);

// --- Review Routes ---
router.get('/reviews/product/:productId', reviewController.getProductReviews);
router.post('/reviews', optionalAuth, reviewController.submitReview);
router.get('/reviews', requireAdmin, reviewController.getAllReviews);
router.put('/reviews/:id', requireAdmin, reviewController.updateReviewStatus);

// --- Admin Dashboard Routes ---
router.get('/admin/stats', requireAdmin, adminController.getDashboardStats);
router.get('/admin/customers', requireAdmin, adminController.getCustomers);
router.get('/admin/inventory', requireAdmin, adminController.getInventory);
router.put('/admin/inventory/bulk', requireAdmin, adminController.updateStockBulk);

// --- Settings & Banners ---
router.get('/settings', settingsController.getSettings);
router.put('/settings', requireAdmin, settingsController.updateSettings);
router.get('/banners', settingsController.getBanners);

export default router;
