package com.example.springaidemo.service;

import com.example.springaidemo.dto.ProductDto;
import com.example.springaidemo.entity.Category;
import com.example.springaidemo.entity.Product;
import com.example.springaidemo.repository.CategoryRepository;
import com.example.springaidemo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getProducts(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return productRepository.findByActiveTrue(pageable).map(this::toDto);
    }

    public Page<ProductDto> filterProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                            Double minRating, String search, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return productRepository.filterProducts(categoryId, minPrice, maxPrice, minRating, search, pageable)
                .map(this::toDto);
    }

    public ProductDto getProductById(Long id) {
        return toDto(productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found")));
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getTopRated() {
        return productRepository.findTop10ByActiveTrueOrderByRatingDesc().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getBestSellers() {
        return productRepository.findTop10ByActiveTrueOrderByReviewCountDesc().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getSimilarProducts(Long productId, Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrueAndIdNot(categoryId, productId, PageRequest.of(0, 6))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<ProductDto> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(query, pageable).map(this::toDto);
    }

    // Admin
    public ProductDto createProduct(ProductDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        Product product = Product.builder()
                .name(dto.getName()).description(dto.getDescription())
                .specifications(dto.getSpecifications()).price(dto.getPrice())
                .originalPrice(dto.getOriginalPrice()).brand(dto.getBrand())
                .sku(dto.getSku()).stock(dto.getStock())
                .images(dto.getImages() != null ? String.join(",", dto.getImages()) : "")
                .category(category).featured(dto.isFeatured()).active(dto.isActive())
                .build();
        return toDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            product.setCategory(category);
        }
        if (dto.getImages() != null) product.setImages(String.join(",", dto.getImages()));
        product.setFeatured(dto.isFeatured());
        product.setActive(dto.isActive());
        return toDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        p.setActive(false);
        productRepository.save(p);
    }

    public ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId()).name(p.getName()).description(p.getDescription())
                .specifications(p.getSpecifications()).price(p.getPrice())
                .originalPrice(p.getOriginalPrice()).brand(p.getBrand())
                .sku(p.getSku()).stock(p.getStock())
                .images(p.getImages() != null && !p.getImages().isEmpty()
                        ? Arrays.asList(p.getImages().split(",")) : List.of())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .rating(p.getRating()).reviewCount(p.getReviewCount())
                .featured(p.isFeatured()).active(p.isActive())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort s = switch (sort != null ? sort : "newest") {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "popular" -> Sort.by("reviewCount").descending();
            default -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(page, size, s);
    }
}
