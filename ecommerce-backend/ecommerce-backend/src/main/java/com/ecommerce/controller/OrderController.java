package com.ecommerce.controller;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.CancelOrderRequest;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.service.CheckoutService;
import com.ecommerce.service.OrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    // ======================
    // 1. CHECKOUT
    // ======================
    @PostMapping("/checkout")
    public Order checkout(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId,
            @RequestBody CheckoutRequest req
    ) {
        return checkoutService.checkout(userId, sessionId, req);
    }


    // ======================
    // 2. LIST ORDER (STEP 8)
    // ======================
    @GetMapping
    public List<Order> getOrders(
            @RequestParam Long userId,
            @RequestParam(required = false) String status
    ) {
        if (status == null || status.isBlank()) {
            return orderService.getOrdersByUser(userId);
        }

        OrderStatus st = OrderStatus.valueOf(status.toUpperCase());
        return orderService.getOrdersByUserAndStatus(userId, st);
    }

    // ======================
    // 3. ORDER DETAIL
    // ======================
    @GetMapping("/{orderId}")
    public Order getOrderDetail(
            @PathVariable Long orderId,
            @RequestParam Long userId
    ) {
        return orderService.getOrderDetail(orderId, userId);
    }

    // ======================
    // 4. CANCEL ORDER (STEP 9)
    // ======================
    @PostMapping("/{orderId}/cancel")
    public Order cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId,
            @RequestBody(required = false) CancelOrderRequest req
    ) {
        String reason = (req != null ? req.getReason() : null);
        return orderService.cancelOrder(orderId, userId, reason);
    }
}
