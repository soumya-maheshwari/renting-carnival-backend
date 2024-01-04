const express = require("express");
const router = express.Router();
const {orderController} = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.post("/create", authVerifyToken, orderController.createOrder);
router.get("/getAll", authVerifyToken, orderController.getAllOrders); // New route to fetch all orders

module.exports = router;
