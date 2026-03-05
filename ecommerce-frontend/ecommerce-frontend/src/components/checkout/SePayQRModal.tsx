import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";

interface SePayQRModalProps {
  orderId: number;
  amount: number | string;
  orderNo: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function SePayQRModal({
  orderId,
  amount,
  orderNo,
  onClose,
  onPaymentSuccess,
}: SePayQRModalProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLL_COUNT = 150; // Poll tối đa 5 phút (150 * 2 giây)

  useEffect(() => {
    // Tạo QR code và payment URL từ SePay
    generateSePayQR();
  }, []);

  useEffect(() => {
    // Polling để kiểm tra trạng thái thanh toán
    // Chỉ bắt đầu polling sau khi QR code đã được tạo
    if (!loading && qrCode && !isPaid && pollCount < MAX_POLL_COUNT) {
      const interval = setInterval(() => {
        setPollCount(prev => prev + 1);
        checkPaymentStatus();
      }, 2000); // Kiểm tra mỗi 2 giây để nhanh hơn

      return () => clearInterval(interval);
    } else if (pollCount >= MAX_POLL_COUNT && !isPaid) {
      // Dừng polling sau 5 phút, hiển thị thông báo
      setError("Đã hết thời gian chờ thanh toán. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.");
    }
  }, [loading, qrCode, isPaid, orderId, pollCount]);

  const generateSePayQR = async () => {
    try {
      setLoading(true);
      
      // Gọi API backend để tạo QR code SePay
      // Convert amount to number if it's a string
      const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      const res = await api.get("/api/sepay/qr", {
        params: {
          orderId,
          amount: amountNum,
          orderNo,
        },
      });
      
      setQrCode(res.data.qrCodeUrl);
      setPaymentUrl(res.data.paymentUrl);
      setLoading(false);
    } catch (err) {
      console.error("Generate SePay QR error:", err);
      setError("Không thể tạo mã QR. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (checkingPayment || isPaid || pollCount >= MAX_POLL_COUNT) return; // Tránh gọi nhiều lần cùng lúc
    
    try {
      setCheckingPayment(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("No userId found");
        return;
      }
      
      // Gọi API để kiểm tra trạng thái đơn hàng
      const res = await api.get(`/api/orders/${orderId}`, {
        params: { userId },
      });
      
      console.log(`[Poll ${pollCount}] Order ${orderId} status:`, res.data.orderStatus);
      
      // Nếu đơn hàng đã được thanh toán (status = PAID hoặc COMPLETED)
      if (res.data.orderStatus === "PAID" || res.data.orderStatus === "COMPLETED") {
        console.log("✅ Payment detected! Order status:", res.data.orderStatus);
        setIsPaid(true);
        // Không cần setTimeout ở đây, useEffect sẽ xử lý chuyển trang
      }
    } catch (err) {
      console.error("❌ Check payment status error:", err);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleManualCheck = () => {
    // Cho phép user tự kiểm tra và xác nhận đã thanh toán
    if (window.confirm("Bạn đã thanh toán thành công chưa?")) {
      setIsPaid(true);
      onPaymentSuccess();
    }
  };

  // Tự động chuyển trang khi đã thanh toán
  useEffect(() => {
    if (isPaid) {
      // Hiển thị thông báo thành công trong 1.5 giây rồi tự động chuyển trang
      const timer = setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isPaid, onPaymentSuccess]);

  if (isPaid) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-4">Đơn hàng #{orderNo} đã được thanh toán thành công.</p>
            <p className="text-sm text-blue-600 mb-6 animate-pulse">Đang chuyển đến trang đơn hàng...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thanh toán SePay</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-semibold text-gray-800">#{orderNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số tiền:</span>
            <span className="text-xl font-bold text-red-600">{amount.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Payment Status Indicator */}
        {!loading && !error && !isPaid && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-700">Đang chờ thanh toán... Hệ thống sẽ tự động cập nhật khi bạn thanh toán thành công.</p>
          </div>
        )}

        {/* QR Code */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tạo mã QR...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={generateSePayQR}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block mb-4">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Quét mã QR bằng ứng dụng SePay để thanh toán
            </p>
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Hoặc mở link thanh toán
            </a>
          </div>
        )}

        {/* Instructions */}
        {!isPaid && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Hướng dẫn thanh toán:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Mở ứng dụng SePay trên điện thoại</li>
              <li>Quét mã QR code ở trên</li>
              <li>Xác nhận thanh toán trong ứng dụng</li>
              <li>Hệ thống sẽ tự động xác nhận và chuyển trang khi thanh toán thành công (không cần làm gì thêm)</li>
            </ol>
          </div>
        )}

        {/* Actions */}
        {!isPaid && (
          <div className="flex gap-3">
            <button
              onClick={handleManualCheck}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            >
              Tôi đã thanh toán (kiểm tra thủ công)
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

