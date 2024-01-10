const express = require("express");
const { stripeWebhookController } = require("../controllers");
const router = express.Router();
const { authVerifyToken } = require("../middleware/authVerifyToken");
const bodyParser = require("body-parser");

router.post(
  "/webhook",
  //   authVerifyToken,
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookController.handleStripeWebhook
);

module.exports = router;
