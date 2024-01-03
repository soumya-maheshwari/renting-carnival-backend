const express = require("express");
const { paymentController } = require("../controllers");
const router = express.Router();

router.post("/checkout", paymentController.paymentMethod)

module.exports = router;