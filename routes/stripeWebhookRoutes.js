const express = require("express");
const { stripeWebhookController } = require("../controllers");
const router = express.Router();

router.post("/webhook", stripeWebhookController.handleStripeWebhook);

module.exports = router