import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardSearchProps {
  product: any;
}

export default function ProductCardSearch({ product }: ProductCardSearchProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  return (
    <div
onClick={() => navigate(`/product/${product.slug}`)}      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageError ? "/no-image.png" : `http://localhost:8080${product.imageUrl}`}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          alt={product.name}
          onError={() => setImageError(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🔥 SALE
            </span>
          </div>
        )}

        {/* Quick View */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
            👁️ Xem nhanh
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {product.salePrice.toLocaleString()}đ
              </span>
              <span className="text-gray-400 line-through text-sm">
                {product.price.toLocaleString()}đ
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {product.price.toLocaleString()}đ
            </span>
          )}

          {product.salePrice && (
            <div className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold">
              -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            🛒 Còn hàng
          </span>

          <span className="flex items-center gap-1 text-sm text-gray-500">
            ⭐ 4.8
          </span>
        </div>
      </div>
    </div>
  );
}
