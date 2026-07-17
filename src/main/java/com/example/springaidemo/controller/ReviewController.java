package com.example.springaidemo.controller;

import com.example.springaidemo.dto.ReviewRequest;
import com.example.springaidemo.entity.User;
import com.example.springaidemo.service.ChatService;
import com.example.springaidemo.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ChatService chatService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> addReview(@AuthenticationPrincipal User user,
                                                          @PathVariable Long productId,
                                                          @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(user.getId(), productId, request));
    }

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<Map<String, String>> summarizeReviews(@PathVariable Long productId,
                                                                 @RequestParam String productName) {
        List<Map<String, Object>> reviews = reviewService.getProductReviews(productId);
        if (reviews.isEmpty()) return ResponseEntity.ok(Map.of("summary", "No reviews yet."));
        StringBuilder sb = new StringBuilder();
        reviews.forEach(r -> sb.append("Rating: ").append(r.get("rating"))
                .append(", Comment: ").append(r.get("comment")).append("\n"));
        String summary = chatService.summarizeReviews(productName, sb.toString());
        return ResponseEntity.ok(Map.of("summary", summary));
    }
}
