const express = require("express");
const router = express.Router();
const { adminController } = require("../controllers");
const { authVerifyToken } = require("../middleware//authVerifyToken");

router.get("/users", authVerifyToken, adminController.allUsers);
router.get("/products", authVerifyToken, adminController.allProducts);
router.post("/add", authVerifyToken, adminController.addProduct);
router.put("/edit/:productId", authVerifyToken, adminController.editProduct);
router.delete(
  "/delete/:productId",
  authVerifyToken,
  adminController.deleteProduct
);

module.exports = router;
