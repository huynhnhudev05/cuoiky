package com.ecommerce.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.SePayQRResponse;
import com.ecommerce.dto.SePayWebhookRequest;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.SePayService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sepay")
@RequiredArgsConstructor
public class SePayController {

    private final SePayService sePayService;
    private final OrderService orderService;

    /**
     * Tạo QR code cho đơn hàng
     */
    @GetMapping("/qr")
    public SePayQRResponse generateQR(
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam String orderNo
    ) {
        String qrCodeUrl = sePayService.generateQRCodeUrl(orderId, amount, orderNo);
        String paymentUrl = sePayService.generatePaymentUrl(orderId, amount, orderNo);

        return SePayQRResponse.builder()
                .qrCodeUrl(qrCodeUrl)
                .paymentUrl(paymentUrl)
                .account("0053264877777")
                .bank("MBBank")
                .amount(amount)
                .description("Thanh toan don hang " + orderNo)
                .build();
    }

    /**
     * Test endpoint để verify webhook có thể được gọi
     */
    @GetMapping("/webhook/test")
    public ResponseEntity<String> testWebhook() {
        return ResponseEntity.ok("Webhook endpoint is accessible! Current time: " + java.time.LocalDateTime.now());
    }

    /**
     * Webhook nhận thông báo thanh toán từ SePay
     * SePay sẽ gọi endpoint này khi có tiền vào tài khoản
     * 
     * Webhook URL: https://saul-unbaffling-norah.ngrok-free.dev/api/sepay/webhook
     * 
     * Lưu ý: SePay webhook cần được cấu hình với header "ngrok-skip-browser-warning: true"
     * hoặc User-Agent không phải browser để bypass ngrok warning page
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody(required = false) String rawBody,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestHeader(value = "Content-Type", required = false) String contentType
    ) {
        try {
            System.out.println("==========================================");
            System.out.println("SePay Webhook CALLED at: " + java.time.LocalDateTime.now());
            System.out.println("User-Agent: " + userAgent);
            System.out.println("Content-Type: " + contentType);
            System.out.println("Raw Body: " + rawBody);
            System.out.println("==========================================");
            
            // Nếu request body null hoặc empty, có thể là ngrok warning page
            if (rawBody == null || rawBody.trim().isEmpty()) {
                System.out.println("WARNING: Request body is null/empty - might be ngrok warning page");
                return ResponseEntity.ok("OK - No body");
            }
            
            // Parse JSON body - SePay có thể gửi nhiều format khác nhau
            SePayWebhookRequest request = null;
            ObjectMapper mapper = new ObjectMapper();
            
            try {
                // Thử parse với SePayWebhookRequest trước
                request = mapper.readValue(rawBody, SePayWebhookRequest.class);
            } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                System.out.println("Failed to parse as SePayWebhookRequest: " + e.getMessage());
                // Nếu không parse được, thử parse như Map để xem structure
                try {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> map = mapper.readValue(rawBody, java.util.Map.class);
                    System.out.println("Parsed as Map: " + map);
                    
                    // Tạo request từ map
                    request = new SePayWebhookRequest();
                    if (map.containsKey("amount")) {
                        request.setAmount(String.valueOf(map.get("amount")));
                    }
                    if (map.containsKey("description") || map.containsKey("des")) {
                        request.setDescription(String.valueOf(map.getOrDefault("description", map.get("des"))));
                    }
                    if (map.containsKey("account")) {
                        request.setAccount(String.valueOf(map.get("account")));
                    }
                    if (map.containsKey("bank")) {
                        request.setBank(String.valueOf(map.get("bank")));
                    }
                    if (map.containsKey("transaction_id") || map.containsKey("transactionId")) {
                        request.setTransactionId(String.valueOf(map.getOrDefault("transaction_id", map.get("transactionId"))));
                    }
                    if (map.containsKey("time")) {
                        request.setTime(String.valueOf(map.get("time")));
                    }
                } catch (com.fasterxml.jackson.core.JsonProcessingException | java.lang.ClassCastException e2) {
                    System.out.println("Error parsing as Map: " + e2.getMessage());
                    System.out.println("Raw body: " + rawBody);
                    return ResponseEntity.ok("OK - Parse error");
                }
            }
            
            if (request == null) {
                System.out.println("Failed to parse request");
                return ResponseEntity.ok("OK - Request is null");
            }
            
            // Extract order number from description
            // SePay có thể gửi nhiều format:
            // - "Thanh toan don hang ORD-XXXXXXXX"
            // - "ORD-XXXXXXXX"
            // - "Don hang ORD-XXXXXXXX"
            String description = request.getDescription();
            if (description == null || description.trim().isEmpty()) {
                System.out.println("Description is null or empty");
                return ResponseEntity.ok("OK - Invalid description");
            }
            
            System.out.println("Description received: " + description);
            
            // Extract order number (e.g., "ORD-XXXXXXXX")
            String orderNo = null;
            
            // Thử nhiều cách extract orderNo
            if (description.contains("ORD-")) {
                // Tìm pattern ORD-XXXXXXXX
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("ORD-[A-Z0-9]+");
                java.util.regex.Matcher matcher = pattern.matcher(description);
                if (matcher.find()) {
                    orderNo = matcher.group();
                }
            }
            
            // Nếu không tìm thấy, thử split
            if (orderNo == null && description.contains("don hang")) {
                String[] parts = description.split("don hang");
                if (parts.length > 1) {
                    orderNo = parts[1].trim();
                }
            }
            
            // Nếu vẫn không có, có thể description chính là orderNo
            if (orderNo == null && description.trim().startsWith("ORD-")) {
                orderNo = description.trim();
            }
            
            if (orderNo == null || orderNo.isEmpty()) {
                System.out.println("Cannot extract orderNo from description: " + description);
                return ResponseEntity.ok("OK - Order number not found in description: " + description);
            }
            
            System.out.println("Extracted orderNo: " + orderNo);
            
            // Find order by orderNo
            var orderOpt = orderService.findByOrderNo(orderNo);
            if (orderOpt.isEmpty()) {
                System.out.println("Order not found: " + orderNo);
                return ResponseEntity.ok("OK - Order not found");
            }
            
            var order = orderOpt.get();
            
            // Check if order is already paid
            if (order.getOrderStatus() == OrderStatus.PAID || 
                order.getOrderStatus() == OrderStatus.COMPLETED) {
                return ResponseEntity.ok("OK - Order already paid");
            }
            
            // Verify amount matches
            // order.getTotalAmount() đã là số tiền sau giảm giá
            // => Chỉ cần cộng thêm phí ship (nếu có), KHÔNG trừ thêm discount lần nữa
            BigDecimal receivedAmount = new BigDecimal(request.getAmount().replace(",", ""));
            BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
            BigDecimal orderAmount = order.getTotalAmount().add(shippingFee);
            
            // Allow small difference (for rounding)
            if (receivedAmount.subtract(orderAmount).abs().compareTo(new BigDecimal("2000")) > 0) {
                System.out.println("Amount mismatch. Expected: " + orderAmount + ", Received: " + receivedAmount);
                return ResponseEntity.ok("OK - Amount mismatch");
            }
            
            // Update order status to PAID
            orderService.updateOrderStatus(
                order.getId(), 
                OrderStatus.PAID, 
                "Đã thanh toán qua SePay. Transaction ID: " + (request.getTransactionId() != null ? request.getTransactionId() : "N/A")
            );
            
            System.out.println("Order " + orderNo + " updated to PAID");
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            System.err.println("Error processing SePay webhook: " + e.getMessage());
            System.err.println("Stack trace: " + java.util.Arrays.toString(e.getStackTrace()));
            return ResponseEntity.ok("OK - Error processed");
        }
    }
}

