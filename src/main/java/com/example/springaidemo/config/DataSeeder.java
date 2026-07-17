package com.example.springaidemo.config;

import com.example.springaidemo.entity.*;
import com.example.springaidemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) return;

        // Categories
        Category electronics = categoryRepository.save(Category.builder().name("Electronics").slug("electronics").description("Gadgets and devices").image("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400").build());
        Category phones = categoryRepository.save(Category.builder().name("Smartphones").slug("smartphones").description("Mobile phones").image("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400").build());
        Category laptops = categoryRepository.save(Category.builder().name("Laptops").slug("laptops").description("Laptops and notebooks").image("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400").build());
        Category fashion = categoryRepository.save(Category.builder().name("Fashion").slug("fashion").description("Clothing and accessories").image("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400").build());
        Category audio = categoryRepository.save(Category.builder().name("Audio").slug("audio").description("Headphones and speakers").image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400").build());

        // Products
        productRepository.saveAll(List.of(
            Product.builder().name("iPhone 15 Pro").brand("Apple").price(new BigDecimal("119900")).originalPrice(new BigDecimal("129900")).stock(50).rating(4.8).reviewCount(1240).featured(true).category(phones).description("Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP camera system.").specifications("Display: 6.1\" Super Retina XDR\nChip: A17 Pro\nCamera: 48MP Main\nStorage: 256GB\nBattery: All-day").images("https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600,https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600").build(),
            Product.builder().name("Samsung Galaxy S24 Ultra").brand("Samsung").price(new BigDecimal("109999")).originalPrice(new BigDecimal("124999")).stock(35).rating(4.7).reviewCount(980).featured(true).category(phones).description("Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, S Pen, and 200MP camera.").specifications("Display: 6.8\" Dynamic AMOLED 2X\nChip: Snapdragon 8 Gen 3\nCamera: 200MP Main\nStorage: 256GB\nBattery: 5000mAh").images("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600").build(),
            Product.builder().name("MacBook Pro 14\" M3").brand("Apple").price(new BigDecimal("168900")).originalPrice(new BigDecimal("189900")).stock(20).rating(4.9).reviewCount(567).featured(true).category(laptops).description("MacBook Pro with M3 chip, Liquid Retina XDR display, and all-day battery life.").specifications("Display: 14.2\" Liquid Retina XDR\nChip: Apple M3\nRAM: 16GB\nStorage: 512GB SSD\nBattery: 22 hours").images("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600").build(),
            Product.builder().name("Dell XPS 15").brand("Dell").price(new BigDecimal("89990")).originalPrice(new BigDecimal("99990")).stock(15).rating(4.5).reviewCount(321).featured(false).category(laptops).description("Dell XPS 15 with Intel Core i7, OLED display, and NVIDIA RTX graphics.").specifications("Display: 15.6\" OLED\nProcessor: Intel Core i7-13700H\nRAM: 16GB DDR5\nStorage: 512GB NVMe\nGPU: NVIDIA RTX 4060").images("https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600").build(),
            Product.builder().name("Sony WH-1000XM5").brand("Sony").price(new BigDecimal("29990")).originalPrice(new BigDecimal("34990")).stock(80).rating(4.8).reviewCount(2100).featured(true).category(audio).description("Industry-leading noise canceling headphones with 30-hour battery.").specifications("Type: Over-ear\nNoise Canceling: Yes\nBattery: 30 hours\nDriver: 30mm\nConnectivity: Bluetooth 5.2").images("https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600").build(),
            Product.builder().name("Apple AirPods Pro 2").brand("Apple").price(new BigDecimal("24900")).originalPrice(new BigDecimal("26900")).stock(60).rating(4.7).reviewCount(1500).featured(true).category(audio).description("AirPods Pro with H2 chip, Adaptive Audio, and USB-C charging.").specifications("Type: In-ear\nNoise Canceling: Active\nBattery: 6 hours (30 with case)\nChip: H2\nConnectivity: Bluetooth 5.3").images("https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600").build(),
            Product.builder().name("OnePlus 12").brand("OnePlus").price(new BigDecimal("64999")).originalPrice(new BigDecimal("69999")).stock(40).rating(4.6).reviewCount(750).featured(false).category(phones).description("OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad cameras, and 100W charging.").specifications("Display: 6.82\" LTPO AMOLED\nChip: Snapdragon 8 Gen 3\nCamera: 50MP Hasselblad\nBattery: 5400mAh\nCharging: 100W SuperVOOC").images("https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600").build(),
            Product.builder().name("ASUS ROG Zephyrus G14").brand("ASUS").price(new BigDecimal("79990")).originalPrice(new BigDecimal("89990")).stock(25).rating(4.6).reviewCount(430).featured(true).category(laptops).description("Compact gaming laptop with AMD Ryzen 9, RTX 4060, and AniMe Matrix display.").specifications("Display: 14\" QHD 165Hz\nProcessor: AMD Ryzen 9 7940HS\nRAM: 16GB DDR5\nGPU: NVIDIA RTX 4060\nStorage: 1TB NVMe").images("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600").build()
        ));

        // Admin user
        if (!userRepository.existsByEmail("admin@shopai.com")) {
            userRepository.save(User.builder()
                    .name("Admin").email("admin@shopai.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN).build());
        }

        // Sample coupons
        couponRepository.saveAll(List.of(
            Coupon.builder().code("WELCOME10").discountType(Coupon.DiscountType.PERCENTAGE).discountValue(new BigDecimal("10")).maxDiscount(new BigDecimal("500")).minOrderAmount(new BigDecimal("999")).active(true).build(),
            Coupon.builder().code("FLAT500").discountType(Coupon.DiscountType.FLAT).discountValue(new BigDecimal("500")).minOrderAmount(new BigDecimal("4999")).active(true).build()
        ));
    }
}
