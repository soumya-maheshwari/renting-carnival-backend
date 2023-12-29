const express = require("express");
const router = express.Router();
const { cartController } = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.post("/add", authVerifyToken, cartController.addToCart);
router.post("/remove", authVerifyToken, cartController.removeFromCart);
router.get("/get", authVerifyToken, cartController.getAllProducts);

module.exports = router;
