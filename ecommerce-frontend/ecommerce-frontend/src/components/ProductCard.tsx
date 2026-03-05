import { api } from "../api/axiosClient";
import { useState } from "react";

interface ProductCardProps {
  p: any;
  sessionId: string;
  userId: string | null;
}

export default function ProductCard({ p, sessionId, userId }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const addToCart = async () => {
    if (isAdding || !p || p.stock === 0) return;
    
    setIsAdding(true);
    try {
      await api.post(
        "/api/cart/add",
        { productId: p.id, quantity: 1 },
        {
          params: { sessionId }, 
        }
      );

      // Hiệu ứng thông báo thành công
      const event = new CustomEvent('cartNotification', { 
        detail: { 
          message: "Đã thêm vào giỏ hàng thành công!", 
          type: "success" 
        }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.log(err);
      const event = new CustomEvent('cartNotification', { 
        detail: { 
          message: "Lỗi khi thêm vào giỏ hàng!", 
          type: "error" 
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageError ? "/no-image.png" : "http://localhost:8080" + p.imageUrl}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          alt={p.name}
        />
        
        {/* Sale Badge */}
        {p.salePrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              GIẢM GIÁ
            </span>
          </div>
        )}

        {/* Category Badge */}
        {p.categoryName && (
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
              {p.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {p.name}
        </h3>

        {/* Price + Stock Section */}
        <div className="mt-auto space-y-2">
          {p.salePrice ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {p.salePrice.toLocaleString()}đ
              </span>
              <span className="text-gray-400 line-through text-sm">
                {p.price.toLocaleString()}đ
              </span>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">
                -{Math.round((1 - p.salePrice / p.price) * 100)}%
              </span>
            </div>
          ) : (
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {p.price.toLocaleString()}đ
              </span>
            </div>
          )}

          {/* Stock badge */}
          {typeof p.stock === "number" && (
            <div className="text-xs font-medium">
              {p.stock === 0 ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-600">
                  🔒 Hết hàng
                </span>
              ) : p.stock < 10 ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  ⚠️ Còn {p.stock} sản phẩm
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700">
                  ✅ Còn {p.stock} sản phẩm
                </span>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart Button (disable when out of stock) */}
        <button
          onClick={addToCart}
          disabled={isAdding || p.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdding || p.stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isAdding ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang thêm...</span>
            </>
          ) : p.stock === 0 ? (
            <span>Hết hàng</span>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl pointer-events-none transition-all duration-300"></div>
    </div>
  );
}