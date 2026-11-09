
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const syncState = () => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setUser(savedUser);
        setCartCount(savedCart.reduce((total, item) => total + item.quantity, 0));
    };

    useEffect(() => {
        syncState();
        window.addEventListener("storage", syncState);
        return () => window.removeEventListener("storage", syncState);
    }, []);

    const handleAdminClick = (e) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || currentUser.role !== "admin") {
            e.preventDefault();
            alert("You are not admin!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        syncState();
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="logo">
                    HASSAAN<span>STORE</span>
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">
                        Cart 🛒 <span className="cart-count">{cartCount}</span>
                    </Link>

                    <Link to="/admin" className="admin-link" onClick={handleAdminClick}>
                        Admin
                    </Link>

                    {user ? (
                        <div className="auth-user">
                            <span>👤 {user.name}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;