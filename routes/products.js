const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

router.post("/product", ProductController.createProduct);
router.get("/product", ProductController.getProducts);
router.get("/:productId", ProductController.getProductById);
router.put("/:productId", ProductController.updateProduct);
router.delete("/:productId", ProductController.deleteProduct);

module.exports = router;
