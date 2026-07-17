package com.example.springaidemo.service;

import com.example.springaidemo.dto.ReviewRequest;
import com.example.springaidemo.entity.*;
import com.example.springaidemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> addReview(Long userId, Long productId, ReviewRequest request) {
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("You have already reviewed this product");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        User user = userRepository.findById(userId).orElseThrow();

        Review review = Review.builder()
                .product(product).user(user)
                .rating(request.getRating()).title(request.getTitle()).comment(request.getComment())
                .build();
        reviewRepository.save(review);

        // Update product rating
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        product.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        product.setReviewCount(product.getReviewCount() + 1);
        productRepository.save(product);

        return toMap(review);
    }

    private Map<String, Object> toMap(Review r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("rating", r.getRating());
        m.put("title", r.getTitle());
        m.put("comment", r.getComment());
        m.put("userName", r.getUser().getName());
        m.put("createdAt", r.getCreatedAt());
        return m;
    }
}
