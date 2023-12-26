const express = require("express");
const router = express.Router();
const { contactController } = require("../controllers");

router.post("/", contactController.contactUs);

module.exports = router;
