package com.example.springaidemo.service;

import com.example.springaidemo.dto.OrderRequest;
import com.example.springaidemo.entity.*;
import com.example.springaidemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Map<String, Object> placeOrder(Long userId, OrderRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));
        if (cart.getItems().isEmpty()) throw new IllegalArgumentException("Cart is empty");

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeAndActiveTrue(request.getCouponCode());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                if (coupon.getMinOrderAmount() == null || total.compareTo(coupon.getMinOrderAmount()) >= 0) {
                    if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                        discount = total.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                    } else {
                        discount = coupon.getDiscountValue();
                    }
                    if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                        discount = coupon.getMaxDiscount();
                    }
                    coupon.setUsedCount(coupon.getUsedCount() + 1);
                    couponRepository.save(coupon);
                }
            }
        }

        BigDecimal finalAmount = total.subtract(discount);
        String orderNumber = "ORD-" + System.currentTimeMillis();

        User user = userRepository.findById(userId).orElseThrow();
        Order order = Order.builder()
                .orderNumber(orderNumber).user(user)
                .totalAmount(total).discount(discount).finalAmount(finalAmount)
                .addressLine1(request.getAddressLine1()).addressLine2(request.getAddressLine2())
                .city(request.getCity()).state(request.getState())
                .pincode(request.getPincode()).country(request.getCountry())
                .paymentMethod(request.getPaymentMethod()).couponCode(request.getCouponCode())
                .status(Order.OrderStatus.CONFIRMED)
                .paymentStatus(Order.PaymentStatus.PAID)
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            // Reduce stock
            Product p = cartItem.getProduct();
            p.setStock(Math.max(0, p.getStock() - cartItem.getQuantity()));
            productRepository.save(p);
            return OrderItem.builder()
                    .order(order).product(p)
                    .quantity(cartItem.getQuantity()).price(p.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return buildOrderResponse(saved);
    }

    public List<Map<String, Object>> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::buildOrderResponse).collect(Collectors.toList());
    }

    public Map<String, Object> getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!order.getUser().getId().equals(userId)) throw new IllegalArgumentException("Access denied");
        return buildOrderResponse(order);
    }

    private Map<String, Object> buildOrderResponse(Order order) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", order.getId());
        m.put("orderNumber", order.getOrderNumber());
        m.put("status", order.getStatus());
        m.put("paymentStatus", order.getPaymentStatus());
        m.put("paymentMethod", order.getPaymentMethod());
        m.put("totalAmount", order.getTotalAmount());
        m.put("discount", order.getDiscount());
        m.put("finalAmount", order.getFinalAmount());
        m.put("createdAt", order.getCreatedAt());
        m.put("address", Map.of(
                "line1", order.getAddressLine1() != null ? order.getAddressLine1() : "",
                "line2", order.getAddressLine2() != null ? order.getAddressLine2() : "",
                "city", order.getCity() != null ? order.getCity() : "",
                "state", order.getState() != null ? order.getState() : "",
                "pincode", order.getPincode() != null ? order.getPincode() : "",
                "country", order.getCountry() != null ? order.getCountry() : ""
        ));
        if (order.getItems() != null) {
            m.put("items", order.getItems().stream().map(item -> Map.of(
                    "id", item.getId(),
                    "productId", item.getProduct().getId(),
                    "productName", item.getProduct().getName(),
                    "quantity", item.getQuantity(),
                    "price", item.getPrice(),
                    "image", item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                            ? item.getProduct().getImages().split(",")[0] : ""
            )).collect(Collectors.toList()));
        }
        return m;
    }
}
