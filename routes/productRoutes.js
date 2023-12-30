const express = require("express");
const router = express.Router();
const { productController } = require("../controllers");
const { upload } = require("../middleware/multer.middleware");
const { authVerifyToken } = require("../middleware/authVerifyToken");

router.post("/create", authVerifyToken, productController.createProduct);
router.get("/getAll", productController.getAllProducts);
router.get("/get/user", authVerifyToken, productController.getUserProducts);
router.delete("/delete/:id", authVerifyToken, productController.deleteProduct);
router.get("/get/:id", productController.getSingleProduct);

module.exports = router;
