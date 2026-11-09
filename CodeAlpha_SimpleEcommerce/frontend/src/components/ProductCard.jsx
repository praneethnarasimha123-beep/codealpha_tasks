
import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
                <span className="category">{product.category}</span>
                <h3>{product.name}</h3>

                <p className="product-description">
                    {product.description ||
                        product.ProductDescription ||
                        product.ProductDetail ||
                        "No description available"}
                </p>

                <div className="rating">
                    <span className="stars">⭐</span>
                    <span>{product.rating || 4.5}</span>
                </div>

                <div className="product-bottom">
                    <div className="price">${Number(product.price).toFixed(2)}</div>
                    <span className="stock">
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                </div>

                <div className="product-buttons">
                    <Link to={`/product/${product._id}`} className="btn details-btn">
                        View Details
                    </Link>

                    <button
                        type="button"
                        className="btn cart-btn"
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;