import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor để xử lý khi tài khoản bị khóa
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu nhận được 403 và message về tài khoản bị khóa
    if (error.response?.status === 403) {
      const message = error.response?.data?.message || "";
      
      if (message.includes("khóa") || message.includes("bị khóa")) {
        // Tự động logout
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        
        // Dispatch event để App.tsx biết và redirect
        window.dispatchEvent(new CustomEvent("account-locked"));
        
        // Redirect về trang chủ
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

