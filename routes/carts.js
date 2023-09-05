const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

// Protect routes with JWT authentication middleware
router.use(authMiddleware);

router.post("/add/:productId", CartController.addToCart);
router.delete("/remove/:productId", CartController.removeFromCart);
router.get("/cart", CartController.getCart);

module.exports = router;
