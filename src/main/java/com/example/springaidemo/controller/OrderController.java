package com.example.springaidemo.controller;

import com.example.springaidemo.dto.OrderRequest;
import com.example.springaidemo.entity.User;
import com.example.springaidemo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(@AuthenticationPrincipal User user,
                                                           @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrder(@AuthenticationPrincipal User user,
                                                         @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id, user.getId()));
    }
}
