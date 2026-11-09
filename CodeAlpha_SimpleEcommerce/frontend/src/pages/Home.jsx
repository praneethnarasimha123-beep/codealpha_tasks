
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:8000/api/products";

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProducts(data.products);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item._id === product._id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage"));
        alert("Product added to cart!");
    };

    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <p className="small-title">WELCOME TO OUR STORE</p>
                    <h1>Shop Smart.<br />Shop Better.</h1>
                    <p>Discover quality products at amazing prices.</p>
                    <Link to="/products" className="btn hero-btn">
                        Shop Now
                    </Link>
                </div>
            </section>

            <section className="featured">
                <div className="section-heading">
                    <p>OUR COLLECTION</p>
                    <h2>Featured Products</h2>
                </div>

                <div className="product-grid">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;