package com.example.springaidemo.controller;

import com.example.springaidemo.dto.ProductDto;
import com.example.springaidemo.entity.User;
import com.example.springaidemo.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user.getId()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> toggle(@AuthenticationPrincipal User user,
                                                       @PathVariable Long productId) {
        boolean added = wishlistService.toggleWishlist(user.getId(), productId);
        return ResponseEntity.ok(Map.of("added", added, "productId", productId));
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<Map<String, Boolean>> check(@AuthenticationPrincipal User user,
                                                       @PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(user.getId(), productId)));
    }
}
