const express = require('express');
const router = express.Router();
const {
  getFavorites,
  toggleFavorite,
  getUsers,
  updateUserRole,
  getDeliveryOrders,
  updateOrderStatus
} = require('../controllers/userController');
const { protect, admin, delivery } = require('../middlewares/auth');

router.route('/favorites').get(protect, getFavorites);
router.route('/favorites/:productId').post(protect, toggleFavorite);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id/role').put(protect, admin, updateUserRole);

// Delivery routes
router.route('/delivery/orders')
  .get(protect, delivery, getDeliveryOrders);
router.route('/delivery/orders/:id')
  .put(protect, delivery, updateOrderStatus);

module.exports = router;