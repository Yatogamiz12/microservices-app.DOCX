const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
});

module.exports = mongoose.model("Order", OrderSchema);
