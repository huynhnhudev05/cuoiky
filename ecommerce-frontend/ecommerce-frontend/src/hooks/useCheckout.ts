import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const useCheckout = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const sessionId = localStorage.getItem("sessionId");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [note, setNote] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    ward: "",
    district: "",
    province: "",
  });
  const [showSePayQR, setShowSePayQR] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const [cartTotal, setCartTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  // LOAD CART
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await api.get("/api/cart", {
          params: { sessionId },
        });

        setCartTotal(res.data.total || 0);
        setFinalTotal(res.data.total || 0);
      } catch (err) {
        console.log("Load cart error:", err);
      }
    };

    loadCart();
  }, []);

  // APPLY COUPON
  const applyCoupon = async () => {
    if (!couponCode.trim()) return alert("Bạn chưa nhập mã giảm giá!");

    try {
      const res = await api.post(
        "/api/cart/apply-coupon",
        { code: couponCode },
        { params: { sessionId } }
      );

      setDiscount(res.data.discountAmount);
      setFinalTotal(res.data.finalTotal);

      alert("🎉 Mã giảm giá đã được áp dụng!");
    } catch (err) {
      console.log("Apply coupon error:", err);
      setDiscount(0);
      setFinalTotal(cartTotal);
      alert("❌ Mã giảm giá không hợp lệ!");
    }
  };

  // CHECKOUT
  const handleCheckout = async () => {
    if (!userId) {
      alert("❌ Bạn cần đăng nhập để đặt hàng!");
      return navigate("/login");
    }

    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.addressLine || 
        !shippingInfo.ward || !shippingInfo.district || !shippingInfo.province) {
      alert("❌ Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    // Ensure sessionId exists
    if (!sessionId) {
      alert("❌ Lỗi session. Vui lòng thử lại!");
      return;
    }

    try {
      // Verify cart has items before checkout
      const cartRes = await api.get("/api/cart", {
        params: { sessionId },
      });
      
      if (!cartRes.data.items || cartRes.data.items.length === 0) {
        alert("❌ Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng.");
        return;
      }

      const body = {
        paymentMethod,
        couponCode: couponCode || null,
        note,
        ...shippingInfo,
      };

      const res = await api.post("/api/orders/checkout", body, {
        params: { userId, sessionId },
      });

      // Nếu là SePay, hiển thị QR code
      if (paymentMethod === "SEPAY") {
        setCreatedOrder(res.data);
        setShowSePayQR(true);
      } else {
        alert("🎉 Đặt hàng thành công!");
        await api.post("/api/cart/clear", null, { params: { sessionId } });
        navigate("/orders/" + res.data.id);
      }
    } catch (err) {
      console.log("Checkout error:", err);
      alert("❌ Lỗi khi đặt hàng!");
    }
  };

  const handleSePaySuccess = async () => {
    setShowSePayQR(false);
    await api.post("/api/cart/clear", null, { params: { sessionId } });
    navigate("/orders/" + createdOrder.id);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    note,
    setNote,
    shippingInfo,
    setShippingInfo,
    cartTotal,
    discount,
    finalTotal,
    applyCoupon,
    handleCheckout,
    showSePayQR,
    setShowSePayQR,
    createdOrder,
    handleSePaySuccess,
  };
};
