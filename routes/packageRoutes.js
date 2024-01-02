const express = require("express");
const router = express.Router();
const { packageController } = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.get("/all", authVerifyToken, packageController.getAllPackages);

module.exports = router;
