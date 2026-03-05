package com.ecommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.OrderStatusHistory;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.OrderStatusHistoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ======================
    // LẤY DANH SÁCH ĐƠN HÀNG
    // ======================
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByUserAndStatus(Long userId, OrderStatus status) {
        return orderRepository.findByUserIdAndOrderStatus(userId, status);
    }

    // ======================
    // CHI TIẾT ĐƠN HÀNG
    // ======================
    public Order getOrderDetail(Long orderId, Long userId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Permission denied: This order does not belong to you");
        }

        return order;
    }

    // ======================
    // HỦY ĐƠN HÀNG
    // ======================
    public Order cancelOrder(Long orderId, Long userId, String reason) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Kiểm tra đơn có phải của user không
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");
        }

        // Kiểm tra trạng thái được phép hủy
        OrderStatus current = order.getOrderStatus();

        switch (current) {
            case PENDING:
            case PAID:
            case PROCESSING:
                break;
            default:
                throw new RuntimeException("Không thể hủy đơn hàng khi đang ở trạng thái: " + current);
        }

        // Cập nhật trạng thái
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // =====================================================
        // HOÀN LẠI SỐ LƯỢNG TỒN KHO NẾU ĐÃ TRỪ TRƯỚC ĐÓ
        // =====================================================
        if (current == OrderStatus.PAID || current == OrderStatus.PROCESSING || current == OrderStatus.SHIPPED) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                Product product = item.getProduct();
                if (product.getStock() != null) {
                    product.setStock(product.getStock() + item.getQuantity());
                    // Tự động mở khóa nếu stock > 0
                    if (product.getStock() > 0 && product.getStatus() == com.ecommerce.enums.ProductStatus.INACTIVE) {
                        product.setStatus(com.ecommerce.enums.ProductStatus.ACTIVE);
                    }
                    productRepository.save(product);
                }
            }
        }

        // Lưu history
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(current)
                .toStatus(OrderStatus.CANCELLED)
                .note((reason != null && !reason.isBlank())
                        ? reason
                        : "Người dùng đã hủy đơn hàng")
                .build();

        historyRepository.save(history);

        // ================================
        // GỬI THÔNG BÁO TIẾNG VIỆT
        // ================================
        User user = userRepository.findById(userId).orElse(null);
        String email = user != null ? user.getEmail() : null;

        // In-app
        notificationService.sendInApp(
                userId,
                "Đơn hàng #" + order.getOrderNo() + " đã bị hủy",
                "Đơn hàng đã được hủy thành công. Lý do: " +
                        (reason != null ? reason : "Không có lý do")
        );

        // Email
        notificationService.sendEmail(
                email,
                "Hủy đơn hàng #" + order.getOrderNo(),
                "Xin chào,\nĐơn hàng #" + order.getOrderNo() +
                        " đã được hủy.\nLý do: " +
                        (reason != null ? reason : "Không có lý do gửi kèm")
        );

        return order;
    }

    // ======================
    // HÀM UPDATE STATUS (DÙNG CHO ADMIN)
    // ======================
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String note) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        OrderStatus oldStatus = order.getOrderStatus();

        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        // =====================================================
        // TRỪ SỐ LƯỢNG TỒN KHO KHI ĐƠN HÀNG ĐƯỢC THANH TOÁN
        // =====================================================
        if (oldStatus != OrderStatus.PAID && newStatus == OrderStatus.PAID) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                Product product = item.getProduct();
                if (product.getStock() != null) {
                    int currentStock = product.getStock();
                    int orderedQty = item.getQuantity();
                    
                    if (currentStock < orderedQty) {
                        throw new RuntimeException("Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho. Còn lại: " + currentStock);
                    }
                    
                    product.setStock(currentStock - orderedQty);
                    
                    // Tự động khóa nếu stock = 0
                    if (product.getStock() == 0) {
                        product.setStatus(com.ecommerce.enums.ProductStatus.INACTIVE);
                    }
                    
                    productRepository.save(product);
                }
            }
        }

        // =====================================================
        // HOÀN LẠI SỐ LƯỢNG KHI ĐƠN HÀNG BỊ HOÀN TRẢ/HOÀN TIỀN
        // =====================================================
        if ((oldStatus == OrderStatus.PAID || oldStatus == OrderStatus.PROCESSING || oldStatus == OrderStatus.SHIPPED) 
            && (newStatus == OrderStatus.RETURNED || newStatus == OrderStatus.REFUNDED)) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                Product product = item.getProduct();
                if (product.getStock() != null) {
                    product.setStock(product.getStock() + item.getQuantity());
                    // Tự động mở khóa nếu stock > 0
                    if (product.getStock() > 0 && product.getStatus() == com.ecommerce.enums.ProductStatus.INACTIVE) {
                        product.setStatus(com.ecommerce.enums.ProductStatus.ACTIVE);
                    }
                    productRepository.save(product);
                }
            }
        }

        // Lưu history
        historyRepository.save(
                OrderStatusHistory.builder()
                        .order(order)
                        .fromStatus(oldStatus)
                        .toStatus(newStatus)
                        .note(note)
                        .build()
        );

        // THÔNG BÁO TIẾNG VIỆT CHO USER
        Long userId = order.getUserId();
        User user = userRepository.findById(userId).orElse(null);
        String email = user != null ? user.getEmail() : null;

        String vnMessage = "";

        switch (newStatus) {
            case PAID:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được thanh toán thành công!";
                break;
                
            case SHIPPED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được giao cho đơn vị vận chuyển.";
                break;

            case DELIVERED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã giao thành công!";
                break;

            case RETURNED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được xác nhận trả hàng.";
                break;

            case REFUNDED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được hoàn tiền.";
                break;

            default:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã chuyển sang trạng thái: " + newStatus;
        }

        // In-app
        notificationService.sendInApp(
                userId,
                "Cập nhật đơn hàng",
                vnMessage
        );

        // Email
        notificationService.sendEmail(
                email,
                "Cập nhật đơn hàng #" + order.getOrderNo(),
                vnMessage
        );

        return order;
    }

    // ======================
    // TÌM ĐƠN HÀNG THEO ORDER NO
    // ======================
    public Optional<Order> findByOrderNo(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo);
        return Optional.ofNullable(order);
    }
}
