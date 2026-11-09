

const Product = require("../models/Product");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// ADD PRODUCT
// =====================================================

const addProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            image,
            category,
            stock,
            rating
        } = req.body;


        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock,
            rating
        });


        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (req, res) => {
    try {

        const productId = req.params.id;

        const {
            name,
            description,
            price,
            image,
            category,
            stock,
            rating
        } = req.body;


        const product = await Product.findById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        // Only update fields that are provided
        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = price;
        }

        if (image !== undefined) {
            product.image = image;
        }

        if (category !== undefined) {
            product.category = category;
        }

        if (stock !== undefined) {
            product.stock = stock;
        }

        if (rating !== undefined) {
            product.rating = rating;
        }


        const updatedProduct = await product.save();


        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.id;


        const product = await Product.findById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        await Product.findByIdAndDelete(productId);


        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};