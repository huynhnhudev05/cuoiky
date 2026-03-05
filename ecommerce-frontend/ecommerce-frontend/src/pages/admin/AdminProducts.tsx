import { useAdminProducts } from "../../hooks/useAdminProducts";
import ProductForm from "../../components/admin/products/ProductForm";
import ProductList from "../../components/admin/products/ProductList";
import { api } from "../../api/axiosClient";

export default function AdminProducts() {
  const role = localStorage.getItem("role");

  if (role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-3">Truy Cập Bị Từ Chối</h1>
          <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang quản trị!</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const {
    categories,
    products,
    product,
    setProduct,
    imageFile,
    setImageFile,
    generateSlug,
    saveProduct,
    deleteProduct,
    editProduct,
    resetForm,
    loadData,
  } = useAdminProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Header với nút quay lại */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </button>
          
          {/* Import/Export Buttons - Đặt ngay đây để dễ thấy */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border-2 border-green-500">
            <button
              onClick={async () => {
                try {
                  const response = await api.get("/products/admin/export", {
                    responseType: "blob",
                  });
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "products.xlsx";
                  link.click();
                  window.URL.revokeObjectURL(url);
                  alert("✅ Export thành công! File đã được tải xuống.");
                } catch (err: any) {
                  alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
                }
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-bold"
            >
              📥 EXPORT EXCEL
            </button>
            <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-bold cursor-pointer">
              📤 IMPORT EXCEL
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const response = await api.post("/products/admin/import", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    if (response.data.success) {
                      alert("✅ Import thành công!");
                      await loadData();
                    } else {
                      alert("⚠️ " + response.data.message);
                    }
                  } catch (err: any) {
                    alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600 mt-2">
                Tạo và quản lý các sản phẩm trong hệ thống của bạn
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              {products.length} sản phẩm
            </div>
          </div>
          
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2">
          {/* Product Form */}
          <div className="xl:col-span-1">
            <ProductForm
              product={product}
              setProduct={setProduct}
              categories={categories}
              imageFile={imageFile}
              setImageFile={setImageFile}
              generateSlug={generateSlug}
              saveProduct={saveProduct}
              resetForm={resetForm}
            />
          </div>

          {/* Product List */}
          <div className="xl:col-span-1">
            <ProductList
              products={products}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
            />
          </div>
        </div>

        {/* Quick Stats */}
      </div>
    </div>
  );
}