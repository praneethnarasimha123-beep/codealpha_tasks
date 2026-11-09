const express = require("express");

const {
    getProfile,
    updateProfile,
    toggleFollow
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;