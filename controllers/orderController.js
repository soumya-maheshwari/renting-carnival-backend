const { ErrorHandler } = require("../middleware/errorHandler");
const Order = require("../models/orderModel");

const createOrder = async (req, res, next) => {
  try {
    const {  customer, products, shippingLocation, totalAmount } = req.body;
    if(!customer || !products || !shippingLocation || !totalAmount) {
      throw new ErrorHandler(400, "all fields are required!");
    }
    const newOrder = await Order.create({
      customer,
      products,
      shippingLocation,
      totalAmount,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("products");
    return res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createOrder, getAllOrders };
