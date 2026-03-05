import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useSearchProducts } from "../hooks/useSearchProducts";
import ProductCardSearch from "../components/ProductCardSearch";

export default function Search() {
  const categories = useCategories();
  const { products, loading, searchProducts } = useSearchProducts();

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");


  const doSearch = () => {
    searchProducts({
      keyword: keyword || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sortBy: sortBy || undefined,
      page: 0,
      size: 20,
    });
  };

  const clearFilters = () => {
    setKeyword("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    // Clear search results when filters are cleared
    searchProducts({});
  };

  const hasActiveFilters = keyword || categoryId || minPrice || maxPrice || sortBy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6">
<div className="flex justify-between items-center mb-6">
  {/* Back Button */}
  <button
    onClick={() => window.location.href = "/"}
    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl 
               hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 19l-7-7 7-7" />
    </svg>
    Quay lại trang chủ
  </button>

</div>

      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Tìm Kiếm Sản Phẩm
          </h1>
          <p className="text-gray-600 text-lg">Khám phá hàng ngàn sản phẩm chất lượng</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Keyword Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tìm kiếm sản phẩm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm bạn muốn tìm..."
                  className="w-full border border-gray-200 p-4 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  
                </div>
              </div>
            </div>

            {/* Search Actions */}
            <div className="flex gap-3">
              <button
                onClick={doSearch}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
<div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">

  {/* Title */}
  <div className="flex items-center gap-2 mb-4">
    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
    <span className="text-sm font-semibold text-gray-700">Bộ lọc nâng cao</span>
  </div>


  {/* FILTER GRID FIXED */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* CATEGORY */}
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Danh mục
      </label>

      <select
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>


    {/* PRICE RANGE FIXED */}
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Khoảng giá
      </label>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Từ"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Đến"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>


    {/* SORT */}
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Sắp xếp theo
      </label>

      <select
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Mặc định</option>
        <option value="newest">Mới nhất</option>
        <option value="priceAsc">Giá: thấp → cao</option>
        <option value="priceDesc">Giá: cao → thấp</option>
        <option value="nameAsc">A → Z</option>
        <option value="nameDesc">Z → A</option>
      </select>
    </div>

  </div>

</div>

        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
              Kết quả tìm kiếm
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                {products.length} sản phẩm
              </span>
            </h2>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm nào</h3>
              <p className="text-gray-500 mb-6">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCardSearch key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}