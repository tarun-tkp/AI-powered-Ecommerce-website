package com.example.springaidemo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank private String addressLine1;
    private String addressLine2;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;
    @NotBlank private String country;
    @NotBlank private String paymentMethod;
    private String couponCode;
}
