const express = require('express');
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/').post(protect, createOrder).get(protect, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').put(protect, admin, updateOrderStatus);

module.exports = router;