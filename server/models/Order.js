const mongoose = require("mongoose");

// Counter schema used internally
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const Counter = mongoose.model("Counter", counterSchema);

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: { type: Number, required: true },
  weight: { type: String },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
    },
  ],
});

const shippingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    address: String,
    latitude: String,
    longitude: String,
  },
  notes: { type: String },
});

const paymentInfoSchema = new mongoose.Schema({
  method: { type: String, enum: ["cod", "card", "paypal"], required: true },
  status: { type: String, default: "pending" },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingInfo: shippingInfoSchema,
  paymentInfo: paymentInfoSchema,
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🧠 Pre-save hook to auto-generate orderNumber
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderNumber = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
