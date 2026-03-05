import { Link } from "react-router-dom";

interface Props {
  orders: any[];
}

export default function OrderList({ orders }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-600";
      case "PAID": return "bg-blue-100 text-blue-600";
      case "PROCESSING": return "bg-purple-100 text-purple-600";
      case "SHIPPED": return "bg-orange-100 text-orange-600";
      case "COMPLETED": return "bg-green-100 text-green-600";
      case "CANCELLED": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "PAID": return "Đã thanh toán";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED": return "Đang giao hàng";
      case "COMPLETED": return "Đã hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có đơn hàng nào</h3>
        <p className="text-gray-500">Các đơn hàng của bạn sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="block bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Order Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Đơn hàng #{order.orderNo}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Tổng tiền hàng: {order.totalAmount.toLocaleString()}₫</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {order.shippingFee > 0 && (
                    <div className="text-gray-600">
                      Phí vận chuyển: {order.shippingFee.toLocaleString()}₫
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="text-green-600">
                      Giảm giá: -{order.discountAmount.toLocaleString()}₫
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {(order.totalAmount + order.shippingFee - order.discountAmount).toLocaleString()}₫
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Tổng thanh toán
              </div>
            </div>
          </div>

          {/* View Details */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Nhấn để xem chi tiết đơn hàng
            </div>
            <div className="text-blue-600 font-medium flex items-center gap-1">
              Xem chi tiết
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}