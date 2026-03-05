import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";

interface Voucher {
  id: number;
  code: string;
  type: "PERCENT" | "FIXED" | "FREESHIP";
  value: number;
  minimumOrderAmount: number | null;
  description: string;
  howToGet: string;
  eligibleUsers: string;
  endAt: string | null;
}

export default function VoucherNotification() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const res = await api.get("/coupons/active");
      setVouchers(res.data || []);
    } catch (err) {
      console.log("Load vouchers error:", err);
    }
  };

  if (vouchers.length === 0) return null;

  return (
    <>
      {/* Banner thông báo */}
      {showBanner && (
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-4 rounded-xl shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">🎉 Voucher mới đã có!</h3>
                <p className="text-sm opacity-90">
                  Có {vouchers.length} voucher đang áp dụng. Nhấn để xem chi tiết!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold backdrop-blur-sm transition-all"
              >
                {showDetails ? "Ẩn" : "Xem chi tiết"}
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết voucher */}
      {showDetails && vouchers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            Danh sách Voucher đang áp dụng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="border-2 border-dashed border-purple-300 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all"
              >
                {/* Code voucher */}
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {v.code}
                  </div>
                  {v.type === "PERCENT" && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      -{v.value}%
                    </span>
                  )}
                  {v.type === "FIXED" && (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      -{v.value.toLocaleString()}₫
                    </span>
                  )}
                  {v.type === "FREESHIP" && (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Freeship
                    </span>
                  )}
                </div>

                {/* Mô tả */}
                <p className="text-gray-700 font-medium mb-2">{v.description}</p>

                {/* Cách nhận */}
                <div className="bg-white/60 rounded-lg p-3 mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">📝 Cách nhận:</span> {v.howToGet}
                  </p>
                </div>

                {/* Ai được nhận */}
                <div className="bg-white/60 rounded-lg p-3 mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">👥 Đối tượng:</span> {v.eligibleUsers}
                  </p>
                </div>

                {/* Thời hạn */}
                {v.endAt && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hết hạn: {new Date(v.endAt).toLocaleDateString("vi-VN")}
                  </div>
                )}

                {/* Copy button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(v.code);
                    alert(`Đã copy mã "${v.code}"! Nhập mã này khi thanh toán để áp dụng.`);
                  }}
                  className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  📋 Copy mã voucher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

