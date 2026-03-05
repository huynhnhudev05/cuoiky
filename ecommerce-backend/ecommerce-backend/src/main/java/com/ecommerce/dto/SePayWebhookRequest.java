package com.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SePayWebhookRequest {
    
    @JsonProperty("amount")
    private String amount;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("account")
    private String account;
    
    @JsonProperty("bank")
    private String bank;
    
    @JsonProperty("transaction_id")
    private String transactionId;
    
    @JsonProperty("time")
    private String time;
}

