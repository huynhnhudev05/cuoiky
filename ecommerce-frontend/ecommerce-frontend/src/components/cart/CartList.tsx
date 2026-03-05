export default function CartList({ cart, updateQty, removeItem }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        {/* <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div> */}
        <h2 className="text-xl font-semibold text-gray-800">Sản phẩm trong giỏ hàng</h2>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {cart.items.length} sản phẩm
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300"
          >
            {/* Product Image */}
            <img
              src={"http://localhost:8080" + item.imageUrl}
              className="w-16 h-16 object-cover rounded-xl border border-gray-300"
              alt={item.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png";
              }}
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-lg truncate">{item.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-red-600 font-bold text-lg">
                  {Number(item.price).toLocaleString()}đ
                </span>
                <span className="text-gray-500 text-sm">
                  {Number(item.price * item.quantity).toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(item.id, "dec")}
                className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center font-semibold"
              >
                –
              </button>

              <span className="font-semibold text-gray-800 min-w-8 text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQty(item.id, "inc")}
                className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center font-semibold"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cart.items.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h3>
          <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
        </div>
      )}
    </div>
  );
}