import { Link } from "react-router-dom";

export default function AdminMenu() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header với gradient */}
      <div className="mb-6">
        <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Quản trị Admin
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
      </div>

      {/* Menu Items */}
      <ul className="flex flex-wrap gap-4 items-stretch">


        <li className="flex-1 min-w-[180px]">
          <Link
            to="/admin/categories"
            className="flex items-center gap-3 p-3 text-gray-700 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 group border border-transparent hover:border-purple-100 h-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-medium">Quản lý danh mục</span>
          </Link>
        </li>

        <li className="flex-1 min-w-[180px]">
          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group border border-transparent hover:border-blue-100 h-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-medium">Quản lý sản phẩm</span>
          </Link>
        </li>

        <li className="flex-1 min-w-[180px]">
          <Link
            to="/admin/coupons"
            className="flex items-center gap-3 p-3 text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-300 group border border-transparent hover:border-green-100 h-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="font-medium">Quản lý mã giảm giá</span>
          </Link>
        </li>

        <li className="flex-1 min-w-[180px]">
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-3 text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 group border border-transparent hover:border-orange-200 h-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h18M9 3v18m6-18v18M3 9h18M3 15h18"
                />
              </svg>
            </div>
            <span className="font-medium">Quản lý đơn hàng</span>
          </Link>
        </li>

        {/* User management */}
        <li className="flex-1 min-w-[180px]">
          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-3 text-gray-700 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 group border border-transparent hover:border-pink-200 h-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-1a4 4 0 00-4-4h-1M9 20H4v-1a4 4 0 014-4h1m4-9a3 3 0 11-6 0 3 3 0 016 0zm8 3a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="font-medium">Quản lý tài khoản</span>
          </Link>
        </li>

      </ul>

      {/* Footer indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Đang hoạt động</span>
        </div>
      </div>
    </div>
  );
}