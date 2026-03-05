import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

import CartHeader from "../../components/cart/CartHeader";
import CartList from "../../components/cart/CartList";

export default function CartPage() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const {
    cart,
    loading,
    total,
    updateQty,
    removeItem,
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <CartHeader name={name} email={email} />

        {/* Empty cart */}
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 text-lg mb-8">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Mua sắm ngay
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartList cart={cart} updateQty={updateQty} removeItem={removeItem} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Tổng thanh toán</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold text-gray-800">{total?.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold text-gray-800">0đ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold text-red-600">0đ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-red-600">{total?.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-lg"
                >
                  Tiến hành thanh toán
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Thanh toán an toàn và bảo mật
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}