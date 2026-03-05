import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../api/axiosClient";
import OrderInfo from "../../components/orders/OrderInfo";
import OrderSummary from "../../components/orders/OrderSummary";
import CancelOrderButton from "../../components/orders/CancelOrderButton";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, []);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/orders/${orderId}`, {
        params: { userId },
      });

      console.log("Order detail:", res.data);
      setOrder(res.data);
    } catch (err) {
      console.log("Error load detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      setCancelling(true);
      await api.post(`/api/orders/${orderId}/cancel`, null, {
        params: { userId },
      });

      alert("Đã hủy đơn hàng!");
      navigate("/orders");
    } catch (err) {
      alert("Không thể hủy đơn hàng!");
      console.log(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
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
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-3">Không tìm thấy đơn hàng</h1>
            <p className="text-gray-600 mb-6">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
            <Link 
              to="/orders" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
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

        {/* Main Content */}
        <div className="space-y-6">
          <OrderInfo order={order} />

          {/* Products Section */}

          <OrderSummary order={order} />

          <CancelOrderButton order={order} cancelOrder={cancelOrder} cancelling={cancelling} />
        </div>
      </div>
    </div>
  );
}