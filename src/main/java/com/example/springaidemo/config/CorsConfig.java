package com.example.springaidemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS)
 * Allows the React frontend running on localhost:5173 to access the backend API
 */
@Configuration
public class CorsConfig {
    
    /**
     * Creates a CORS filter to allow cross-origin requests
     * @return CorsFilter configured to allow requests from localhost:5173
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Allow frontend origin
        config.addAllowedOrigin("http://localhost:5173");
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow preflight requests
        config.addAllowedOrigin("http://localhost:5173");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
