const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protect routes with JWT authentication middleware
router.use(authMiddleware);

router.get("/profile", UserController.getUserProfile);
router.put("/updateProfile", UserController.updateUserProfile);

module.exports = router;
