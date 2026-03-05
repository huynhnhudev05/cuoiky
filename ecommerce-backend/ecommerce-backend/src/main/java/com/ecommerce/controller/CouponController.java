package com.ecommerce.controller;

import com.ecommerce.dto.CouponPublicResponse;
import com.ecommerce.enums.CouponType;
import com.ecommerce.model.Coupon;
import com.ecommerce.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/active")
    public List<CouponPublicResponse> getActiveCoupons() {
        LocalDateTime now = LocalDateTime.now();
        
        List<Coupon> coupons = couponRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getActive()))
                .filter(c -> c.getStartAt() == null || !c.getStartAt().isAfter(now))
                .filter(c -> c.getEndAt() == null || !c.getEndAt().isBefore(now))
                .filter(c -> c.getUsageLimit() == null || c.getUsedCount() < c.getUsageLimit())
                .collect(Collectors.toList());

        return coupons.stream().map(this::mapToPublicResponse).collect(Collectors.toList());
    }

    private CouponPublicResponse mapToPublicResponse(Coupon c) {
        String description = "";
        String howToGet = "";
        String eligibleUsers = "";

        // Mô tả voucher dựa trên type
        switch (c.getType()) {
            case PERCENT:
                description = "Giảm " + c.getValue() + "% giá trị đơn hàng";
                break;
            case FIXED:
                description = "Giảm " + String.format("%,d", c.getValue()) + "₫ cho đơn hàng";
                break;
            case FREESHIP:
                description = "Miễn phí vận chuyển";
                break;
        }

        // Điều kiện đơn hàng tối thiểu
        if (c.getMinimumOrderAmount() != null && c.getMinimumOrderAmount() > 0) {
            description += " (Áp dụng cho đơn hàng từ " + String.format("%,d", c.getMinimumOrderAmount()) + "₫)";
        }

        // Cách nhận voucher
        howToGet = "Nhập mã '" + c.getCode() + "' khi thanh toán để áp dụng";

        // Ai được nhận
        if (c.getUsageLimit() != null) {
            int remaining = c.getUsageLimit() - (c.getUsedCount() != null ? c.getUsedCount() : 0);
            eligibleUsers = "Tất cả khách hàng. Còn lại " + remaining + " lượt sử dụng";
        } else {
            eligibleUsers = "Tất cả khách hàng";
        }

        // Thời hạn
        if (c.getEndAt() != null) {
            howToGet += ". Voucher có hiệu lực đến " + c.getEndAt().toLocalDate();
        }

        return CouponPublicResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .type(c.getType())
                .value(c.getValue())
                .minimumOrderAmount(c.getMinimumOrderAmount())
                .usageLimit(c.getUsageLimit())
                .usedCount(c.getUsedCount())
                .startAt(c.getStartAt())
                .endAt(c.getEndAt())
                .description(description)
                .howToGet(howToGet)
                .eligibleUsers(eligibleUsers)
                .build();
    }
}

