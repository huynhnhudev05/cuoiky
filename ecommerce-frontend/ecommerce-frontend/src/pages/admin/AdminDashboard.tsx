import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import AdminMenu from "../../components/AdminMenu";

type StatCard = {
  label: string;
  value: number | string;
  color: string;
  hint?: string;
  loading?: boolean;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Sản phẩm", value: "...", color: "from-blue-500 to-blue-600", loading: true },
    { label: "Đơn hàng", value: "...", color: "from-emerald-500 to-emerald-600", loading: true },
    { label: "Mã giảm giá", value: "...", color: "from-orange-500 to-orange-600", loading: true },
    { label: "Danh mục", value: "...", color: "from-purple-500 to-purple-600", loading: true },
  ]);

  const loadStats = async () => {
    try {
      const [prods, orders, coupons, categories] = await Promise.all([
        api.get("/products/admin"),
        api.get("/api/admin/orders"),
        api.get("/admin/coupons"),
        api.get("/categories"),
      ]);

      setStats([
        { label: "Sản phẩm", value: prods.data?.length || 0, color: "from-blue-500 to-blue-600" },
        { label: "Đơn hàng", value: orders.data?.length || 0, color: "from-emerald-500 to-emerald-600" },
        { label: "Mã giảm giá", value: coupons.data?.length || 0, color: "from-orange-500 to-orange-600" },
        { label: "Danh mục", value: categories.data?.length || 0, color: "from-purple-500 to-purple-600" },
      ]);
    } catch (err) {
      console.log("Load stats error:", err);
      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value: "—",
          loading: false,
        }))
      );
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Chào mừng */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Chào mừng quay lại</p>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bảng điều khiển Admin
            </h1>
            <p className="text-gray-600 mt-2">
              Truy cập nhanh các chức năng quản trị bên dưới.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-semibold">
              Đang hoạt động
            </div>
          </div>
        </div>

        {/* Thống kê nhanh (live data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center font-bold`}
              >
                {card.value}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-lg font-semibold text-gray-800">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Menu chính */}
        <AdminMenu />

        {/* Ghi chú hỗ trợ */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 text-sm text-gray-600">
          Số liệu lấy trực tiếp từ API admin. Nếu muốn thêm doanh thu hoặc biểu đồ,
          có thể gọi endpoint doanh thu theo ngày và render chart đơn giản.
        </div>
      </div>
    </div>
  );
}

