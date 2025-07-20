const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "favorites",
    "name price image description category"
  );

  res.json(user.favorites);
});

// @desc    Toggle favorite product
// @route   POST /api/users/favorites/:productId
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const isFavorite = user.favorites.includes(productId);

  if (isFavorite) {
    // Remove from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== productId
    );
  } else {
    // Add to favorites
    user.favorites.push(productId);
  }

  await user.save();

  res.json({
    success: true,
    isFavorite: !isFavorite,
  });
});
// Add to userController.js

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role;
  await user.save();

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  });
});

// @desc    Get delivery partner orders
// @route   GET /api/users/delivery/orders
// @access  Private/Delivery
const getDeliveryOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    orderStatus: { $in: ['processing', 'shipped'] }
  }).populate('user', 'firstName lastName phone');

  res.json(orders);
});

// @desc    Update order status (delivery partner)
// @route   PUT /api/users/delivery/orders/:id
// @access  Private/Delivery
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = req.body.status;
  
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.json(order);
});

// Add to module.exports
module.exports = {
  getFavorites,
  toggleFavorite,
  getUsers,
  updateUserRole,
  getDeliveryOrders,
  updateOrderStatus
};
