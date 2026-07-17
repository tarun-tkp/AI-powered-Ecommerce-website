package com.example.springaidemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application class
 * Entry point for the Spring AI Demo application
 */
@SpringBootApplication
public class Application {
    
    /**
     * Main method to start the Spring Boot application
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
