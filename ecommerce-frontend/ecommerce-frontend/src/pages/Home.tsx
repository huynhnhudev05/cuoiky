import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import AdminMenu from "../components/AdminMenu";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import VoucherNotification from "../components/VoucherNotification";

export default function Home() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // sessionId cho guest
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [promo, setPromo] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0); // ⭐ thêm state orderCount

  // ===========================
  // LOGOUT
  // ===========================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ===========================
  // LOAD CART COUNT
  // ===========================
  const loadCartCount = async () => {
    try {
      const res = await api.get("/api/cart", { 
        params: { sessionId } 
      });

      const count = res.data?.items?.length || 0;
      setCartCount(count);
    } catch (err) {
      console.log("Cart count error:", err);
    }
  };

  // ===========================
  // LOAD ORDER COUNT
  // ===========================
  const loadOrderCount = async () => {
    try {
      if (!userId) return; // guest không có order

      const res = await api.get("/api/orders", {
        params: { userId }
      });

      setOrderCount(res.data.length || 0);
    } catch (err) {
      console.log("Order count error:", err);
    }
  };

  // ===========================
  // LOAD HOME DATA
  // ===========================
  const loadHomeData = async () => {
    try {
      const res = await api.get("/products");
      const products = res.data || [];

      setAllProducts(products);

      const latestList = [...products]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 8);

      const promoList = products
        .filter((p: any) => p.salePrice != null && p.salePrice !== 0)
        .slice(0, 8);

      setLatest(latestList);
      setPromo(promoList);
    } catch (err) {
      console.log("Home load error:", err);
    }
  };

  // ===========================
  // USE EFFECT
  // ===========================
  useEffect(() => {
    loadHomeData();
    loadCartCount();
    loadOrderCount(); // ⭐ load thêm số lượng đơn hàng
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ⭐ Header có cartCount + orderCount */}
<Header 
  name={name || ""} 
  email={email || ""} 
  logout={logout} 
  cartCount={cartCount}
  orderCount={orderCount}
/>

        {/* ======================== */}
        {/* VOUCHER NOTIFICATION */}
        {/* ======================== */}
        <VoucherNotification />

        {/* ======================== */}
        {/* ADMIN MENU */}
        {/* ======================== */}
        {role === "ROLE_ADMIN" && (
          <div className="mb-8">
            <AdminMenu />
          </div>
        )}

        {/* ======================== */}
        {/* SECTION: SẢN PHẨM MỚI NHẤT */}
        {/* ======================== */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sản phẩm mới nhất
            </h2>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {latest.length} sản phẩm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latest.map((p) => (
              <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
            ))}
          </div>
        </section>

        {/* ======================== */}
        {/* SECTION: SẢN PHẨM GIẢM GIÁ */}
        {/* ======================== */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Sản phẩm đang giảm giá
            </h2>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {promo.length} sản phẩm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promo.map((p) => (
              <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
            ))}
          </div>
        </section>

        {/* ======================== */}
        {/* SECTION: TẤT CẢ SẢN PHẨM */}
        {/* ======================== */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tất cả sản phẩm
            </h2>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {allProducts.length} sản phẩm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((p) => (
              <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
