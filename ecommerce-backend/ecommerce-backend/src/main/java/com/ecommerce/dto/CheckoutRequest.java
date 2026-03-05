package com.ecommerce.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String paymentMethod;
    private String note;
    private String couponCode;
    
    // Shipping information
    private String fullName;
    private String phone;
    private String addressLine;
    private String ward;
    private String district;
    private String province;
}
