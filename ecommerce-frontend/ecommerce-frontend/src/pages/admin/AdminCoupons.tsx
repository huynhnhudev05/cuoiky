import { Link } from "react-router-dom";
import { useAdminCoupons } from "../../hooks/useAdminCoupons";
import CouponForm from "../../components/admin/coupons/CouponForm";
import CouponList from "../../components/admin/coupons/CouponList";

export default function AdminCoupons() {
  const {
    coupons,
    loading,
    form,
    updateField,
    createCoupon,
    deleteCoupon,
  } = useAdminCoupons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
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
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Quản lý mã giảm giá
            </h1>
            <p className="text-gray-600 mt-2">
              Tạo và quản lý các mã giảm giá, khuyến mãi trong hệ thống
            </p>
          </div>
          <div className="ml-auto bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            {coupons.length} mã giảm giá
          </div>
        </div>

        {/* Coupon Form */}
        <div className="mb-8">
          <CouponForm
            form={form}
            updateField={updateField}
            createCoupon={createCoupon}
          />
        </div>

        {/* Coupon List */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Đang tải mã giảm giá...</p>
              </div>
            </div>
          ) : (
            <CouponList coupons={coupons} deleteCoupon={deleteCoupon} />
          )}
        </div>

        {/* Quick Stats */}

      </div>
    </div>
  );
}