import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/admin"
          className={`sidebar-link ${isActive("/admin") ? "active" : ""}`}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/manage-products"
          className={`sidebar-link ${
            isActive("/admin/manage-products") ? "active" : ""
          }`}
        >
          📦 Manage Products
        </Link>

        <Link
          to="/admin/add-product"
          className={`sidebar-link ${
            isActive("/admin/add-product") ? "active" : ""
          }`}
        >
          ➕ Add Product
        </Link>

        <Link
          to="/admin/orders"
          className={`sidebar-link ${
            isActive("/admin/orders") ? "active" : ""
          }`}
        >
          🛒 Orders
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link exit-link">
          ⬅ Back to Store
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;