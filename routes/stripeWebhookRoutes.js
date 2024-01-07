const express = require("express");
const { stripeWebhookController } = require("../controllers");
const router = express.Router();
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.post(
  "/webhook",
  //   authVerifyToken,
  stripeWebhookController.handleStripeWebhook
);

module.exports = router;
