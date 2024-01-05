const express = require("express");
const router = express.Router();
const { profileController } = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.put("/edit", authVerifyToken, profileController.editProfile);
router.get("/package", authVerifyToken, profileController.showPackage);

module.exports = router;
