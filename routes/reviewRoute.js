const express = require("express");
const router = express.Router();
const {reviewController} = require("../controllers");
const {authVerifyToken} = require("../middleware/authVerifyToken")

router.post("/create", authVerifyToken, reviewController.createReview);
router.get("/getAll", reviewController.getAllReviews);
router.get("/get/:id", reviewController.getProductReview);
router.delete("/delete/:id", authVerifyToken, reviewController.deleteReview);

module.exports = router;