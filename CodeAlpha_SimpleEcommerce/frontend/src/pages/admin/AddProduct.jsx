
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/products";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
  rating: ""
};

function AddProduct() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          rating: Number(form.rating)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ text: "✅ Product added successfully!", isError: false });
        setForm(INITIAL_FORM_STATE);
      } else {
        setMessage({
          text: "❌ " + (data.message || "Failed to add product."),
          isError: true
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        text: "❌ Could not connect to server.",
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="admin-form-container">
        <div className="admin-form-header">
          <p className="admin-label">ADMIN PANEL</p>
          <h1>Add New Product</h1>
          <p>Add a new product to your online store.</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Wireless Headphones"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Electronics"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              name="description"
              placeholder="Enter product description..."
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                placeholder="59.99"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="20"
                min="0"
                value={form.stock}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {form.image && (
            <div className="image-preview">
              <p>Image Preview</p>
              <img
                src={form.image}
                alt="Preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {message.text && (
            <div className={`admin-message ${message.isError ? "error" : "success"}`}>
              {message.text}
            </div>
          )}

          <div className="form-buttons">
            <Link to="/admin" className="cancel-btn">
              Cancel
            </Link>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddProduct;