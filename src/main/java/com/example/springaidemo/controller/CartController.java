package com.example.springaidemo.controller;

import com.example.springaidemo.dto.CartItemRequest;
import com.example.springaidemo.entity.User;
import com.example.springaidemo.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addItem(@AuthenticationPrincipal User user,
                                                        @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(user.getId(), request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> updateItem(@AuthenticationPrincipal User user,
                                                           @PathVariable Long itemId,
                                                           @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(cartService.updateQuantity(user.getId(), itemId, body.get("quantity")));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> removeItem(@AuthenticationPrincipal User user,
                                                           @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeFromCart(user.getId(), itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }
}
