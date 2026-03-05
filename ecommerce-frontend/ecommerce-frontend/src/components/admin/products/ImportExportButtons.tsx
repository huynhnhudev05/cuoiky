import { useState } from "react";
import { api } from "../../../api/axiosClient";

interface ImportExportButtonsProps {
  refreshProducts: () => void;
}

export default function ImportExportButtons({ refreshProducts }: ImportExportButtonsProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get("/products/admin/export", {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert("✅ Export thành công! File đã được tải xuống.");
    } catch (error: any) {
      console.error("Export error:", error);
      alert("❌ Lỗi khi export: " + (error.response?.data?.message || error.message));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("❌ Chỉ chấp nhận file Excel (.xlsx hoặc .xls)");
      return;
    }

    try {
      setImporting(true);
      setImportError(null);
      setImportSuccess(false);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/products/admin/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setImportSuccess(true);
        alert("✅ Import thành công!");
        refreshProducts();
      } else {
        const errors = response.data.errors || [];
        const errorMsg = response.data.message + (errors.length > 0 ? "\n\nLỗi chi tiết:\n" + errors.slice(0, 5).join("\n") : "");
        setImportError(errorMsg);
        alert("⚠️ " + errorMsg);
      }
    } catch (error: any) {
      console.error("Import error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
      setImportError(errorMsg);
      alert("❌ Lỗi khi import: " + errorMsg);
    } finally {
      setImporting(false);
      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="flex items-center gap-2" style={{ minWidth: 'fit-content', flexShrink: 0 }}>
      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
      >
        {exporting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang export...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Excel</span>
          </>
        )}
      </button>

      {/* Import Button */}
      <label className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap" style={{ flexShrink: 0 }}>
        {importing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang import...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Import Excel</span>
          </>
        )}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
          disabled={importing}
          className="hidden"
        />
      </label>
    </div>
  );
}

