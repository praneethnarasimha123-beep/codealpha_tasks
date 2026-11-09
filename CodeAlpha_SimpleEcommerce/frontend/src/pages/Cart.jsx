
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("storage"));
    };

    const increase = (index) => {
        const newCart = [...cart];
        newCart[index].quantity++;
        updateCart(newCart);
    };

    const decrease = (index) => {
        const newCart = [...cart];
        if (newCart[index].quantity > 1) {
            newCart[index].quantity--;
        } else {
            newCart.splice(index, 1);
        }
        updateCart(newCart);
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        updateCart(newCart);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main>
            <section className="cart-section">
                <div className="section-heading">
                    <p>YOUR SHOPPING</p>
                    <h1>Shopping Cart</h1>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-list">
                            {cart.map((item, index) => (
                                <div className="cart-item" key={item._id}>
                                    <img src={item.image} alt={item.name} />

                                    <div className="cart-info">
                                        <span className="category">{item.category}</span>
                                        <h3>{item.name}</h3>
                                        <p>${item.price}</p>
                                    </div>

                                    <div className="cart-quantity">
                                        <button onClick={() => decrease(index)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increase(index)}>+</button>
                                    </div>

                                    <strong className="cart-item-total">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </strong>

                                    <button className="remove-btn" onClick={() => removeItem(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div>
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>

                            <Link to="/checkout" className="btn checkout-btn">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Cart;