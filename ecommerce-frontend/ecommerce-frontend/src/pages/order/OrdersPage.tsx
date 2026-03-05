import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/axiosClient";
import OrderFilter from "../../components/orders/OrderFilter";
import OrderList from "../../components/orders/OrderList";

export default function OrdersPage() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders", {
        params: { userId, status },
      });

      console.log("Orders:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.log("Load order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header với nút quay lại */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600 mt-2">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </p>
          </div>
          <div className="ml-auto bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            {orders.length} đơn hàng
          </div>
        </div>

        {/* Order Filter */}
        <div className="mb-8">
          <OrderFilter status={status} setStatus={setStatus} />
        </div>

        {/* Order List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}

        {/* Quick Stats */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.orderStatus === 'PENDING').length}
              </div>
              <div className="text-sm text-blue-500 font-medium">Chờ xác nhận</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.orderStatus === 'PROCESSING').length}
              </div>
              <div className="text-sm text-purple-500 font-medium">Đang xử lý</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.orderStatus === 'SHIPPED').length}
              </div>
              <div className="text-sm text-orange-500 font-medium">Đang giao</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus === 'COMPLETED').length}
              </div>
              <div className="text-sm text-green-500 font-medium">Hoàn thành</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}