const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Customer model if available
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
  ],
  shippingLocation : {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
