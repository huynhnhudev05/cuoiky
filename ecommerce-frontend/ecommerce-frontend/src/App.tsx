import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// PUBLIC PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ProductDetail from "./pages/product/ProductDetail";

// SHOPPING PAGES
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrdersPage from "./pages/order/OrdersPage";
import OrderDetailPage from "./pages/order/OrderDetailPage";

// ADMIN PAGES
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const [role, setRole] = useState<string>(localStorage.getItem("role") || "");

  useEffect(() => {
    const syncRole = () => setRole(localStorage.getItem("role") || "");
    const handleAccountLocked = () => {
      // Clear role để force redirect về trang user
      localStorage.removeItem("role");
      setRole("");
      // Show alert
      alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.");
    };
    
    window.addEventListener("storage", syncRole);
    window.addEventListener("role-changed", syncRole);
    window.addEventListener("account-locked", handleAccountLocked);
    
    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("role-changed", syncRole);
      window.removeEventListener("account-locked", handleAccountLocked);
    };
  }, []);

  const isAdmin = role === "ROLE_ADMIN";

  return (
    <BrowserRouter>
      {isAdmin ? (
        <Routes>
          {/* Admin-only area */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          {/* Allow login in case admin logs out */}
          <Route path="/login" element={<Login />} />
          {/* Redirect everything else into admin home */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      ) : (
        <Routes>
          {/* ===================== PUBLIC ROUTES ===================== */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Product */}
          <Route path="/product/:slug" element={<ProductDetail />} />

          {/* Search */}
          <Route path="/search" element={<Search />} />

          {/* ===================== SHOPPING ROUTES ===================== */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />

          {/* Any admin route hit by non-admin goes home */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
