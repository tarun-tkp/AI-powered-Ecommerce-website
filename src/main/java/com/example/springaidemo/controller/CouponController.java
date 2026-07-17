package com.example.springaidemo.controller;

import com.example.springaidemo.entity.Coupon;
import com.example.springaidemo.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/validate/{code}")
    public ResponseEntity<Map<String, Object>> validate(@PathVariable String code,
                                                         @RequestParam BigDecimal orderAmount) {
        return couponRepository.findByCodeAndActiveTrue(code).map(coupon -> {
            if (coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
                return ResponseEntity.ok(Map.<String, Object>of(
                        "valid", false,
                        "message", "Minimum order amount is ₹" + coupon.getMinOrderAmount()));
            }
            BigDecimal discount;
            if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                discount = orderAmount.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                    discount = coupon.getMaxDiscount();
                }
            } else {
                discount = coupon.getDiscountValue();
            }
            return ResponseEntity.ok(Map.<String, Object>of(
                    "valid", true,
                    "discount", discount,
                    "type", coupon.getDiscountType(),
                    "value", coupon.getDiscountValue()
            ));
        }).orElse(ResponseEntity.ok(Map.of("valid", false, "message", "Invalid or expired coupon")));
    }
}
