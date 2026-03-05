import { useState, useEffect } from "react";
import { api } from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // 🔥 Nếu đã đăng nhập → tự động quay về trang chủ
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // quay lại home
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      alert(res.data); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 w-96 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng ký</h2>

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          className="w-full p-3 border rounded mb-3"
          onChange={onChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={onChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="w-full p-3 border rounded mb-4"
          onChange={onChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>

        <p className="text-center mt-4 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
