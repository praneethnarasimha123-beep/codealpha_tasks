
const express = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route ko /register kar dein
router.post("/register", signup); 
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;