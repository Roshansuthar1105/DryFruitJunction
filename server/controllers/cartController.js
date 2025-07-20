const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
// Update the getCart controller to properly populate images
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name description images category variants',
    populate: {
      path: 'images',
      select: 'url alt'
    }
  });
  
  if (!cart) {
    return res.json({ items: [] });
  }

  // Map items to include variant details
  const itemsWithVariants = cart.items.map(item => {
    const product = item.product;
    const variant = product.variants.find(v => v._id.toString() === item.variant.toString());
    return {
      ...item.toObject(),
      variantDetails: variant,
      price: variant ? variant.price : item.price,
      weight: variant ? variant.weight : item.weight
    };
  });

  res.json({ ...cart.toObject(), items: itemsWithVariants });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the selected variant
  const selectedVariant = product.variants.find(v => v._id.toString() === variantId);
  if (!selectedVariant) {
    res.status(404);
    throw new Error('Variant not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  // If cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  // Check if item with same product and variant already exists in cart
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && 
           item.variant.toString() === variantId
  );

  if (itemIndex > -1) {
    // Update quantity if item exists
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price: selectedVariant.price,
      weight: selectedVariant.weight
    });
  }

  await cart.save();
  res.status(201).json(cart);
});
// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  await cart.save();
  res.json({ message: 'Cart cleared successfully' });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};