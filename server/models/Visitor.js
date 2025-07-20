const mongoose = require("mongoose");
const visitorCounterSchema = new mongoose.Schema({
  name: { type: String, default: "visitors", unique: true },
  count: { type: Number, default: 0 },
});
module.exports = mongoose.model('Visitor', visitorCounterSchema);