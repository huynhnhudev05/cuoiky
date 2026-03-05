interface ShippingInfoFormProps {
  shippingInfo: {
    fullName: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    province: string;
  };
  setShippingInfo: (info: any) => void;
}

export default function ShippingInfoForm({
  shippingInfo,
  setShippingInfo,
}: ShippingInfoFormProps) {
  const handleChange = (field: string, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <label className="font-semibold text-gray-700 text-lg">Thông tin giao hàng</label>
      </div>

      <div className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên người nhận <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Nhập họ và tên"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={shippingInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ chi tiết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
            placeholder="Số nhà, tên đường"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Phường/Xã */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.ward}
            onChange={(e) => handleChange("ward", e.target.value)}
            placeholder="Nhập phường/xã"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Quận/Huyện */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.district}
            onChange={(e) => handleChange("district", e.target.value)}
            placeholder="Nhập quận/huyện"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Tỉnh/Thành phố */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.province}
            onChange={(e) => handleChange("province", e.target.value)}
            placeholder="Nhập tỉnh/thành phố"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>
      </div>
    </div>
  );
}

