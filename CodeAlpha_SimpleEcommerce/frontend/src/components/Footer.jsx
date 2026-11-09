
import { Link } from "react-router-dom";

function Footer() {
    const handleAdminClick = (e) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || currentUser.role !== "admin") {
            e.preventDefault();
            alert("You are not admin!");
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section footer-brand">
                    <h2>Hassaan Store</h2>
                    <p>Your simple and modern online shopping store. Find quality products at affordable prices.</p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Shopping Cart</Link>
                    <Link to="/checkout">Checkout</Link>
                </div>

                <div className="footer-section">
                    <h3>Admin</h3>
                    <Link to="/admin" onClick={handleAdminClick}>Admin Dashboard</Link>
                    <Link to="/admin/add-product" onClick={handleAdminClick}>Add Product</Link>
                    <Link to="/admin/products" onClick={handleAdminClick}>Manage Products</Link>
                    <Link to="/admin/orders" onClick={handleAdminClick}>Orders</Link>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>📧 support@hassaanstore.com</p>
                    <p>📞 +92 300 1234567</p>
                    <p>📍 Pakistan</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 <span>Hassaan Store</span>. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;