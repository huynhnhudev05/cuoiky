package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SePayQRResponse {
    private String qrCodeUrl;
    private String paymentUrl;
    private String account;
    private String bank;
    private BigDecimal amount;
    private String description;
}

