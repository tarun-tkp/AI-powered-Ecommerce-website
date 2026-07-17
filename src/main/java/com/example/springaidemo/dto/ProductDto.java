package com.example.springaidemo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String specifications;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String brand;
    private String sku;
    private Integer stock;
    private List<String> images;
    private Long categoryId;
    private String categoryName;
    private Double rating;
    private Integer reviewCount;
    private boolean featured;
    private boolean active;
    private LocalDateTime createdAt;
}
