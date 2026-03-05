import { useState } from "react";
import CouponInput from "../../components/checkout/CouponInput";
import NoteInput from "../../components/checkout/NoteInput";
import PaymentMethodSelect from "../../components/checkout/PaymentMethodSelect";
import ShippingInfoForm from "../../components/checkout/ShippingInfoForm";
import SePayQRModal from "../../components/checkout/SePayQRModal";
import SummaryBox from "../../components/checkout/SummaryBox";
import { useCheckout } from "../../hooks/useCheckout";

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    note,
    setNote,
    shippingInfo,
    setShippingInfo,
    cartTotal,
    discount,
    finalTotal,
    applyCoupon,
    handleCheckout,
    showSePayQR,
    setShowSePayQR,
    createdOrder,
    handleSePaySuccess,
  } = useCheckout();

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await handleCheckout();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Thanh toán đơn hàng
            </h1>
            <p className="text-gray-600 mt-2">
              Hoàn tất thông tin để hoàn thành đơn hàng của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <ShippingInfoForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <PaymentMethodSelect
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <CouponInput
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <NoteInput note={note} setNote={setNote} />
            </div>
          </div>

          {/* Right Column - Summary & Checkout */}
          <div className="lg:col-span-1 space-y-6">
            <SummaryBox
              cartTotal={cartTotal}
              discount={discount}
              finalTotal={finalTotal}
            />

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                } text-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Xác nhận đặt hàng
                  </>
                )}
              </button>

              <button
                onClick={() => (window.location.href = "/cart")}
                disabled={isSubmitting}
                className={`w-full mt-3 p-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-0.5 shadow'
                }`}
              >
                Quay lại giỏ hàng
              </button>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  Bằng cách xác nhận, bạn đồng ý với{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    điều khoản và điều kiện
                  </a>{" "}
                  của chúng tôi
                </p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-3">Thanh toán an toàn</h3>
                <div className="flex justify-center gap-4 text-gray-400">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-xs">Bảo mật</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-xs">Đảm bảo</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="text-xs">Hỗ trợ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SePay QR Modal */}
      {showSePayQR && createdOrder && (
        <SePayQRModal
          orderId={createdOrder.id}
          amount={finalTotal}
          orderNo={createdOrder.orderNo}
          onClose={() => setShowSePayQR(false)}
          onPaymentSuccess={handleSePaySuccess}
        />
      )}
    </div>
  );
}