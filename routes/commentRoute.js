const express = require("express");
const router = express.Router();
const {commentController} = require("../controllers");
const {authVerifyToken} = require("../middleware/authVerifyToken")

router.get("/create", authVerifyToken, commentController.createComment);
router.get("/get", commentController.getAllComments);

module.exports = router;