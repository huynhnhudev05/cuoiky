package com.ecommerce.dto;

import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    private String role;      // ROLE_USER or ROLE_ADMIN
    private Boolean enabled;  // true = active, false = locked
}


