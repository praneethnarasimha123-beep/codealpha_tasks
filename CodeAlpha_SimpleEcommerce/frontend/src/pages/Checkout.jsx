
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));

    const [form, setForm] = useState({
        customerName: user ? user.name : "",
        email: user ? user.email : "",
        phone: "",
        address: ""
    });

    const [message, setMessage] = useState("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        const token = localStorage.getItem("token");
        const orderData = {
            ...form,
            items: cart.map((item) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: total
        };

        try {
            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("storage"));
                setMessage(`Order placed successfully! Order ID: ${data.order._id}`);
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setMessage(data.message || "Failed to place order.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong. Check your backend.");
        }
    };

    return (
        <main>
            <section className="checkout-section">
                <div className="section-heading">
                    <p>COMPLETE YOUR ORDER</p>
                    <h1>Checkout</h1>
                </div>

                <div className="checkout-grid">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Full Name"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="address"
                            placeholder="Delivery Address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="btn">
                            Place Order
                        </button>
                    </form>

                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        {cart.map((item) => (
                            <div className="summary-item" key={item._id}>
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                        ))}

                        <hr />
                        <div className="summary-total">
                            <span>Total</span>
                            <strong>${total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                {message && <div className="order-message">{message}</div>}

                <Link to="/cart" className="back-link">
                    ← Back to Cart
                </Link>
            </section>
        </main>
    );
}

export default Checkout;