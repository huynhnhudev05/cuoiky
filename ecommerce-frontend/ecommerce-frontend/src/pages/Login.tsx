import { useState, useEffect } from "react";
import { api } from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Nếu đã đăng nhập → tự động quay về trang chủ
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(role === "ROLE_ADMIN" ? "/admin/products" : "/");
    }
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post("/auth/login", form);

      const token = res.data.token;
      const userId = res.data.id;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", res.data.role);
      // thông báo cho App biết role đã thay đổi để tách router admin
      window.dispatchEvent(new Event("role-changed"));
      
      // Gọi profile
      const profile = await api.get(`/api/profile?userId=${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      localStorage.setItem("name", profile.data.name);
      localStorage.setItem("email", profile.data.email);
      localStorage.setItem("avatar", profile.data.avatarUrl || "");

      const target = res.data.role === "ROLE_ADMIN" ? "/admin" : "/";
      navigate(target);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Lỗi đăng nhập");
      } else {
        alert("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Đăng nhập
          </h1>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={submit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400 pr-12"
                  onChange={onChange}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400 pr-12"
                  onChange={onChange}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform ${
                loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Đăng nhập</span>
                </div>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <Link 
                  to="/register" 
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">
              điều khoản sử dụng
            </a>{" "}
            của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}