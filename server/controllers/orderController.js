const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, paymentMethod } = req.body;

  // Get user's cart with populated product and variant info
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name images variants'
  });
  
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // Prepare order items with variant info
  const orderItems = cart.items.map((item) => {
    const variant = item.product.variants.find(v => v._id.toString() === item.variant.toString());
    return {
      product: item.product._id,
      variant: item.variant,
      name: item.product.name,
      quantity: item.quantity,
      price: variant.price,
      weight: variant.weight,
      images: item.product.images
    };
  });

  // Calculate prices
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = 0; // Free shipping for now
  const totalPrice = itemsPrice + shippingPrice;

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingInfo,
    paymentInfo: {
      method: paymentMethod,
    },
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  
  // Clear the cart
  cart.items = [];
  await cart.save();

  res.status(201).json(createdOrder);
});

// Update getOrderById to populate variant info
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "firstName lastName email")
    .populate({
      path: "orderItems.product",
      select: "name variants"
    });

  if (order) {
    // Enhance order items with variant details
    const enhancedOrder = {
      ...order.toObject(),
      orderItems: order.orderItems.map(item => {
        const product = item.product;
        const variant = product.variants.find(v => v._id.toString() === item.variant.toString());
        return {
          ...item,
          variantDetails: variant
        };
      })
    };

    // Check if the order belongs to the user or if user is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(401);
      throw new Error("Not authorized to view this order");
    }

    res.json(enhancedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "firstName lastName");
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = "delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// Update the updateOrderStatus function
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Additional business logic checks if needed
  if (status === "delivered") {
    order.deliveredAt = Date.now();
  }

  order.orderStatus = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
};
