const express = require("express");
const router = express.Router();
const {productController} = require("../controllers");
const {upload} = require("../middleware/multer.middleware")
const {authVerifyToken} = require("../middleware/authVerifyToken")

router.post('/create', authVerifyToken, upload.array('product-image', 5), productController.createProduct);
router.get("/getAll", authVerifyToken, productController.getAllProducts);
router.get("/get/user", authVerifyToken, productController.getUserProducts);
router.delete("/delete/:id", authVerifyToken, productController.deleteProduct);

module.exports = router;