
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/products";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];
        setProducts(productList);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  return (
    <main>
      <div className="admin-dashboard">
        <div
          className="admin-form-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <p className="admin-label">ADMIN PANEL</p>
            <h1>Manage Products</h1>
          </div>
          <Link to="/admin/add-product" className="btn" style={{ textDecoration: "none" }}>
            + Add New Product
          </Link>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <p style={{ padding: "2rem", textAlign: "center" }}>Loading products table...</p>
          ) : error ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--danger-color)" }}>{error}</p>
          ) : !Array.isArray(products) || products.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center" }}>No products found in database.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>
                      <img
                        src={p.image || "https://via.placeholder.com/45"}
                        alt={p.name}
                        className="table-img"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/45";
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(p._id || p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

export default ManageProducts;