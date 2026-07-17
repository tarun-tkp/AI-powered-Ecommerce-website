package com.example.springaidemo.controller;

import com.example.springaidemo.dto.ProductDto;
import com.example.springaidemo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String search) {

        if (categoryId != null || minPrice != null || maxPrice != null || minRating != null || search != null) {
            return ResponseEntity.ok(productService.filterProducts(categoryId, minPrice, maxPrice, minRating, search, page, size, sort));
        }
        return ResponseEntity.ok(productService.getProducts(page, size, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductDto>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductDto>> getTopRated() {
        return ResponseEntity.ok(productService.getTopRated());
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<ProductDto>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<ProductDto>> getSimilar(@PathVariable Long id, @RequestParam Long categoryId) {
        return ResponseEntity.ok(productService.getSimilarProducts(id, categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.searchProducts(q, page, size));
    }
}
