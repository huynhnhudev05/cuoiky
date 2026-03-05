import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import type { ProductDetail } from "../../types/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userId = localStorage.getItem("userId");
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = "guest_" + crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  useEffect(() => {
    if (!slug) return;

    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log("Error load product:", err));
  }, [slug]);

  const addToCart = async () => {
    if (!product || adding) return;
    setAdding(true);

    try {
      await api.post(
        "/api/cart/add",
        { productId: product.id, quantity: 1 },
        {
          params: { sessionId },
        }
      );

      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err: any) {
      console.log(err);
      alert("Thêm vào giỏ hàng thất bại!");
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 bg-white text-gray-700 px-5 py-3 rounded-xl 
                     hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={imageError ? "/no-image.png" : `http://localhost:8080${product.imageUrl}`}
                  className="w-full h-96 object-cover"
                  alt={product.name}
                  onError={() => setImageError(true)}
                />
                {product.salePrice && product.salePrice < product.price && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      GIẢM GIÁ
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                {product.categoryName && (
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {product.categoryName}
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                {product.salePrice && product.salePrice < product.price ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-red-600">
                      {product.salePrice.toLocaleString()}đ
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold">
                      -{Math.round((1 - product.salePrice / product.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-green-600">
                    {product.price.toLocaleString()}đ
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Còn hàng</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Bảo hành 12 tháng</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={adding}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                  adding
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {adding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang thêm vào giỏ hàng...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-lg">Thêm vào giỏ hàng</span>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Chính hãng</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Giao hàng nhanh</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}