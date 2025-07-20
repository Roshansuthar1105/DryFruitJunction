// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Some activities might be system-generated
  },
  type: {
    type: String,
    required: true,
    enum: ['login','product_images_add','product_image_delete', 'signup', 'product_add', 'product_update','product_delete', 'order_placed', 'order_shipped', 'order_delivered', 'order_cancelled']
  },
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);