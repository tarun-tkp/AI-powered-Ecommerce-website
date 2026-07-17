package com.example.springaidemo.service;

import com.example.springaidemo.entity.*;
import com.example.springaidemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, Object> getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    @Transactional
    public Map<String, Object> addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
            cartItemRepository.save(existing.get());
        } else {
            CartItem item = CartItem.builder().cart(cart).product(product).quantity(quantity).build();
            cart.getItems().add(item);
        }
        cartRepository.save(cart);
        return buildCartResponse(getOrCreateCart(userId));
    }

    @Transactional
    public Map<String, Object> updateQuantity(Long userId, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return buildCartResponse(getOrCreateCart(userId));
    }

    @Transactional
    public Map<String, Object> removeFromCart(Long userId, Long itemId) {
        cartItemRepository.deleteById(itemId);
        return buildCartResponse(getOrCreateCart(userId));
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            return cartRepository.save(Cart.builder().user(user).build());
        });
    }

    private Map<String, Object> buildCartResponse(Cart cart) {
        List<Map<String, Object>> items = cart.getItems().stream().map(item -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", item.getId());
            m.put("quantity", item.getQuantity());
            m.put("productId", item.getProduct().getId());
            m.put("productName", item.getProduct().getName());
            m.put("price", item.getProduct().getPrice());
            m.put("image", item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                    ? item.getProduct().getImages().split(",")[0] : "");
            m.put("stock", item.getProduct().getStock());
            return m;
        }).collect(Collectors.toList());

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("total", total);
        response.put("itemCount", items.size());
        return response;
    }
}
