package com.ecommerce.model;

import com.ecommerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")   // ⭐⭐⭐ BẮT BUỘC
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNo;

    private Long userId;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private LocalDateTime createdAt;

    private String couponCode;
    
    // Shipping information
    private String shippingFullName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingWard;
    private String shippingDistrict;
    private String shippingProvince;
    private String note;
}
