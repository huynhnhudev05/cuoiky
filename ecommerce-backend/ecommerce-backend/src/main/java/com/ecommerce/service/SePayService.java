package com.ecommerce.service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SePayService {

    @Value("${sepay.bank.account:0053264877777}")
    private String sepayAccount;

    @Value("${sepay.bank.name:MBBank}")
    private String sepayBank;

    /**
     * Tạo URL QR code SePay
     */
    public String generateQRCodeUrl(Long orderId, BigDecimal amount, String orderNo) {
        String description = "Thanh toan don hang " + orderNo;
        
        try {
            String encodedDes = URLEncoder.encode(description, StandardCharsets.UTF_8);
            long amountLong = amount.longValue();
            String qrUrl = String.format(
                "https://qr.sepay.vn/img?acc=%s&bank=%s&amount=%d&des=%s",
                sepayAccount,
                sepayBank,
                amountLong,
                encodedDes
            );
            return qrUrl;
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo QR code SePay", e);
        }
    }

    /**
     * Tạo payment URL cho SePay
     */
    public String generatePaymentUrl(Long orderId, BigDecimal amount, String orderNo) {
        String description = "Thanh toan don hang " + orderNo;
        try {
            String encodedDes = URLEncoder.encode(description, StandardCharsets.UTF_8);
            long amountLong = amount.longValue();
            return String.format(
                "sepay://payment?acc=%s&bank=%s&amount=%d&des=%s&orderId=%d",
                sepayAccount,
                sepayBank,
                amountLong,
                encodedDes,
                orderId
            );
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo payment URL", e);
        }
    }
}

