const express = require("express");
const { paymentController } = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");
const router = express.Router();

router.post("/checkout", authVerifyToken, paymentController.paymentMethod);
router.post(
  "/buy_package",
  authVerifyToken,
  paymentController.paymentMethodPackage
);

module.exports = router;
