import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import AdminMenu from "../../components/AdminMenu";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  enabled: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminUser[]>("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Load users error:", err);
      alert("Lỗi khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (user: AdminUser, patch: Partial<AdminUser>) => {
    try {
      setUpdatingId(user.id);
      const body = {
        role: patch.role ?? user.role,
        enabled: patch.enabled ?? user.enabled,
      };
      await api.put(`/api/admin/users/${user.id}`, body);
      await loadUsers();
    } catch (err: any) {
      console.error("Update user error:", err);
      alert(err.response?.data?.message || "Lỗi khi cập nhật tài khoản");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleRole = (user: AdminUser) => {
    const newRole = user.role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN";
    if (!confirm(`Bạn có chắc muốn đổi quyền của ${user.email} thành ${newRole}?`)) return;
    updateUser(user, { role: newRole });
  };

  const toggleEnabled = (user: AdminUser) => {
    const newEnabled = !user.enabled;
    if (
      !confirm(
        newEnabled
          ? `Mở khóa tài khoản cho ${user.email}?`
          : `Khóa tài khoản của ${user.email}? Người dùng sẽ không đăng nhập được.`
      )
    )
      return;
    updateUser(user, { enabled: newEnabled });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Quản lý tài khoản
            </h1>
            <p className="text-gray-600 mt-2">
              Xem danh sách người dùng, phân quyền User/Admin và khóa/mở khóa tài khoản.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            {users.length} tài khoản
          </div>
        </div>

        {/* Main menu shortcuts */}
        <AdminMenu />

        {/* Users table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span>Đang tải danh sách tài khoản...</span>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có tài khoản nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Tên</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">SĐT</th>
                    <th className="px-4 py-3 text-left">Quyền</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">#{u.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === "ROLE_ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role === "ROLE_ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.enabled ? "Đã kích hoạt" : "Đã khóa / Chưa kích hoạt"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          disabled={updatingId === u.id}
                          onClick={() => toggleRole(u)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                        >
                          {u.role === "ROLE_ADMIN" ? "Chuyển thành User" : "Chuyển thành Admin"}
                        </button>
                        <button
                          disabled={updatingId === u.id}
                          onClick={() => toggleEnabled(u)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            u.enabled
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          } disabled:opacity-50`}
                        >
                          {u.enabled ? "Khóa tài khoản" : "Mở khóa"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


