
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:8000/api/products";

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

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

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main>
            <section className="page-header">
                <p>OUR SHOP</p>
                <h1>All Products</h1>
                <p>Find the perfect products for you.</p>
            </section>

            <section className="products-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="product-grid">
                    {filteredProducts.map((product) => (
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

export default Products;