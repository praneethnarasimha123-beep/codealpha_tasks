
const express = require("express");

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();


// Get all products
router.get("/", getProducts);


// Get single product
router.get("/:id", getProductById);


// Add product
router.post("/", addProduct);


// Update product
router.put("/:id", updateProduct);


// Delete product
router.delete("/:id", deleteProduct);


module.exports = router;