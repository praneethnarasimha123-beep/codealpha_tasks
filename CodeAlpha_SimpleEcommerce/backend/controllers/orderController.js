
const Order = require("../models/Order");

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            email,
            phone,
            address,
            items,
            totalAmount
        } = req.body;

        if (
            !customerName ||
            !email ||
            !phone ||
            !address ||
            !items ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information"
            });
        }

        const order = await Order.create({
            customerName,
            email,
            phone,
            address,
            items,
            totalAmount
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ===============================
// GET ALL ORDERS
// ===============================
const getOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ===============================
// UPDATE ORDER STATUS
// ===============================
const updateOrderStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        // Check status
        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update status
        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        console.error("Update Order Status Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};