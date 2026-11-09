
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/products";

function AdminDashboard() {
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
        // Safe check for Array response
        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];
        setProducts(productList);
      } else {
        setError("Failed to fetch product stats.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

  return (
    <main>
      <div className="admin-dashboard">
        <div className="admin-form-header">
          <p className="admin-label">ADMIN PANEL</p>
          <h1>Dashboard Overview</h1>
        </div>

        {loading ? (
          <p style={{ padding: "2rem", textAlign: "center" }}>Loading dashboard data...</p>
        ) : error ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--danger-color)" }}>{error}</p>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="form-row" style={{ marginBottom: "2rem" }}>
              <div className="admin-form-container" style={{ textAlign: "center", padding: "1.5rem" }}>
                <p className="admin-label">Total Products</p>
                <h2>{products.length}</h2>
              </div>
              <div className="admin-form-container" style={{ textAlign: "center", padding: "1.5rem" }}>
                <p className="admin-label">Total Items in Stock</p>
                <h2>{totalStock}</h2>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="form-buttons" style={{ justifyContent: "flex-start", gap: "1rem" }}>
              <Link to="/admin/add-product" className="btn" style={{ textDecoration: "none" }}>
                + Add Product
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;