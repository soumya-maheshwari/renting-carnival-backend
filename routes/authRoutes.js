const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { authVerifyToken } = require("../middleware//authVerifyToken");

router.post("/login", authController.login);
router.post("/email", authController.signUpWithEmail);
router.post("/email/verify", authController.emailVerify);
router.post("/signup", authVerifyToken, authController.signUpTwo);

module.exports = router;
