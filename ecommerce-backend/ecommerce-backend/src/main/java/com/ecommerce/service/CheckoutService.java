package com.ecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.enums.CouponType;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Coupon;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.OrderStatusHistory;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.OrderStatusHistoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final CouponRepository couponRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Order checkout(Long userId, String sessionId, CheckoutRequest req) {

        // Debug log
        System.out.println("Checkout - userId: " + userId + ", sessionId: " + sessionId);
        
        CartResponse cart = cartService.getCart(sessionId);
        
        // Debug log
        System.out.println("Cart items count: " + (cart.getItems() != null ? cart.getItems().size() : 0));
        
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
        }

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingFee = BigDecimal.valueOf(30000);
        BigDecimal discount = BigDecimal.ZERO;

        Coupon coupon = null;

        // =====================================================
        // CHECK COUPON
        // =====================================================
        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {

            coupon = couponRepository.findByCode(req.getCouponCode())
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

            if (!Boolean.TRUE.equals(coupon.getActive())) {
                throw new RuntimeException("Mã giảm giá không hoạt động");
            }

            LocalDateTime now = LocalDateTime.now();
            if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
                throw new RuntimeException("Mã giảm giá chưa bắt đầu");
            }
            if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn");
            }

            if (coupon.getUsageLimit() != null &&
                    coupon.getUsedCount() >= coupon.getUsageLimit()) {
                throw new RuntimeException("Mã giảm giá đã sử dụng hết");
            }

            if (coupon.getMinimumOrderAmount() != null &&
                    total.compareTo(BigDecimal.valueOf(coupon.getMinimumOrderAmount())) < 0) {
                throw new RuntimeException("Không đủ điều kiện áp dụng mã");
            }

            // =====================================================
            // APPLY DISCOUNT
            // =====================================================
            if (coupon.getType() == CouponType.PERCENT) {
                discount = total
                        .multiply(BigDecimal.valueOf(coupon.getValue()))
                        .divide(BigDecimal.valueOf(100));
            }

            else if (coupon.getType() == CouponType.FIXED) {
                discount = BigDecimal.valueOf(coupon.getValue());
            }

            else if (coupon.getType() == CouponType.FREESHIP) {
                shippingFee = BigDecimal.ZERO;
            }
        }

        BigDecimal finalAmount = total.subtract(discount);

        String orderNo = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderNo(orderNo)
                .userId(userId)
                .totalAmount(finalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discount)
                .paymentMethod(req.getPaymentMethod())
                .orderStatus(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .couponCode(req.getCouponCode())
                .shippingFullName(req.getFullName())
                .shippingPhone(req.getPhone())
                .shippingAddressLine(req.getAddressLine())
                .shippingWard(req.getWard())
                .shippingDistrict(req.getDistrict())
                .shippingProvince(req.getProvince())
                .note(req.getNote())
                .build();

        order = orderRepository.save(order);

        // Save order items và kiểm tra số lượng tồn kho
        for (CartItemResponse ci : cart.getItems()) {

            Product product = productRepository.findById(ci.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // =====================================================
            // KIỂM TRA SỐ LƯỢNG TỒN KHO TRƯỚC KHI TẠO ĐƠN HÀNG
            // =====================================================
            if (product.getStock() != null) {
                int currentStock = product.getStock();
                int orderedQty = ci.getQuantity();
                
                if (currentStock < orderedQty) {
                    throw new RuntimeException("Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho. Hiện còn: " + currentStock + " sản phẩm.");
                }
                
                // Kiểm tra sản phẩm có đang bị khóa không
                if (product.getStatus() == com.ecommerce.enums.ProductStatus.INACTIVE) {
                    throw new RuntimeException("Sản phẩm '" + product.getName() + "' hiện không khả dụng.");
                }
            }

            orderItemRepository.save(
                    OrderItem.builder()
                            .order(order)
                            .product(product)
                            .price(ci.getPrice())
                            .quantity(ci.getQuantity())
                            .subtotal(ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                            .build()
            );
        }

        // Save history
        historyRepository.save(
                OrderStatusHistory.builder()
                        .order(order)
                        .fromStatus(null)
                        .toStatus(OrderStatus.PENDING)
                        .note("Tạo đơn hàng")
                        .build()
        );

        // Update coupon count
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        cart.getItems().clear();

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            notificationService.sendInApp(
                    userId,
                    "Đặt hàng thành công",
                    "Đơn hàng #" + orderNo + " đã được tạo thành công."
            );

            notificationService.sendEmail(
                    user.getEmail(),
                    "Xác nhận đơn hàng",
                    "Đơn hàng #" + orderNo + " đã được đặt thành công."
            );
        }

        return order;
    }
}
