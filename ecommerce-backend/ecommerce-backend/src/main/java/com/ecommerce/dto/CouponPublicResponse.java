package com.ecommerce.dto;

import com.ecommerce.enums.CouponType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponPublicResponse {
    private Long id;
    private String code;
    private CouponType type;
    private Integer value;
    private Integer minimumOrderAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    
    // Thông tin mô tả
    private String description; // Mô tả voucher
    private String howToGet; // Cách nhận voucher
    private String eligibleUsers; // Ai được nhận
}

