
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/products";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`${API_URL}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProduct(data.product);
                }
            })
            .catch((error) => console.error(error));
    }, [id]);

    if (!product) {
        return <div className="loading">Loading product...</div>;
    }

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item._id === product._id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage"));
        alert("Product added to cart!");
        navigate("/cart");
    };

    return (
        <main>
            <section className="details-container">
                <div className="product-detail">
                    <div className="detail-image">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="detail-info">
                        <span className="category">{product.category}</span>
                        <h1>{product.name}</h1>

                        <p className="description">
                            {product.description ||
                                product.ProductDescription ||
                                product.ProductDetail ||
                                "No description available"}
                        </p>

                        <div className="rating">⭐ {product.rating || 4.5}</div>
                        <div className="price">${Number(product.price).toFixed(2)}</div>

                        <span className="stock">
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>

                        <div className="quantity-selector">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        product.stock ? Math.min(product.stock, q + 1) : q + 1
                                    )
                                }
                                disabled={product.stock > 0 && quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn cart-btn"
                            onClick={addToCart}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ProductDetails;