package com.example.springaidemo.service;

import com.example.springaidemo.dto.ProductDto;
import com.example.springaidemo.entity.*;
import com.example.springaidemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public List<ProductDto> getWishlist(Long userId) {
        return getOrCreate(userId).getProducts().stream()
                .map(productService::toDto).collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreate(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        boolean removed = wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
        if (!removed) wishlist.getProducts().add(product);
        wishlistRepository.save(wishlist);
        return !removed; // true = added
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return getOrCreate(userId).getProducts().stream().anyMatch(p -> p.getId().equals(productId));
    }

    private Wishlist getOrCreate(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            return wishlistRepository.save(Wishlist.builder().user(user).build());
        });
    }
}
