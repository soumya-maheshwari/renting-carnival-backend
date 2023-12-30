const express = require("express");
const router = express.Router();
const { wishlistController } = require("../controllers");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.post("/add", authVerifyToken, wishlistController.addToWishlist);
router.get("/get", authVerifyToken, wishlistController.getWishlist);
router.post("/remove", authVerifyToken, wishlistController.removeFromWishlist);

module.exports = router;
