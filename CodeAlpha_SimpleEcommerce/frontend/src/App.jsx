
import { Routes, Route } from "react-router-dom";

// Layout & Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddProduct from "./pages/admin/AddProduct";
import Orders from "./pages/admin/Orders";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* ---------------- PUBLIC STORE ROUTES ---------------- */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/products"
        element={
          <>
            <Navbar />
            <Products />
            <Footer />
          </>
        }
      />
      <Route
        path="/product/:id"
        element={
          <>
            <Navbar />
            <ProductDetails />
            <Footer />
          </>
        }
      />
      <Route
        path="/cart"
        element={
          <>
            <Navbar />
            <Cart />
            <Footer />
          </>
        }
      />
      <Route
        path="/checkout"
        element={
          <>
            <Navbar />
            <Checkout />
            <Footer />
          </>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------------- ADMIN PANEL ROUTES ---------------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="manage-products" element={<ManageProducts />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default App;