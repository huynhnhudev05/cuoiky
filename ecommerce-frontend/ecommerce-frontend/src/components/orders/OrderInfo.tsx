interface Props {
  order: any;
}

export default function OrderInfo({ order }: Props) {
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "COD": return "Thanh toán khi nhận hàng";
      case "BANKING": return "Chuyển khoản ngân hàng";
      case "SEPAY": return "SePay";
      default: return method;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết đơn hàng #{order.orderNo}
        </h1>
      </div>

      {/* Order Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Trạng thái đơn hàng</label>
          <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
            {getStatusLabel(order.orderStatus)}
          </div>
        </div>

        {/* Order Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ngày đặt hàng</label>
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {getPaymentMethodLabel(order.paymentMethod)}
          </div>
        </div>

        {/* Order ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
          <div className="bg-gray-100 px-3 py-2 rounded-lg text-gray-800 font-mono text-sm">
            {order.id}
          </div>
        </div>

        {/* Total Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tổng thanh toán</label>
          <div className="text-xl font-bold text-red-600">
            {(order.totalAmount + order.shippingFee - order.discountAmount).toLocaleString()}₫
          </div>
        </div>

        {/* Customer Note */}
        {order.note && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              {order.note}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Information */}
      {(order.shippingFullName || order.shippingPhone || order.shippingAddressLine) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Thông tin giao hàng
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {order.shippingFullName && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Người nhận:</span>
                <span className="text-gray-800">{order.shippingFullName}</span>
              </div>
            )}
            {order.shippingPhone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Số điện thoại:</span>
                <span className="text-gray-800">{order.shippingPhone}</span>
              </div>
            )}
            {(order.shippingAddressLine || order.shippingWard || order.shippingDistrict || order.shippingProvince) && (
              <div className="flex items-start gap-2">
                <span className="text-gray-600 font-medium">Địa chỉ:</span>
                <span className="text-gray-800">
                  {[
                    order.shippingAddressLine,
                    order.shippingWard,
                    order.shippingDistrict,
                    order.shippingProvince
                  ].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}