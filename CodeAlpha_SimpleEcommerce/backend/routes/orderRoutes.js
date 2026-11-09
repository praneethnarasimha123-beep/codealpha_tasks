
const express = require("express");

const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();


// Create Order
router.post("/", createOrder);


// Get All Orders
router.get("/", getOrders);


// Update Order Status
router.put("/:id/status", updateOrderStatus);


module.exports = router;