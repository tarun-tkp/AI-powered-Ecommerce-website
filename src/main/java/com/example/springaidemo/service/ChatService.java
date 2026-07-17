package com.example.springaidemo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private static final String SYSTEM_PROMPT = """
            You are ShopAI Assistant, a helpful shopping assistant for an AI-powered e-commerce platform.
            You help customers with:
            - Product recommendations based on budget, use case, or preferences
            - Comparing products (specs, price, pros/cons)
            - Finding the best deals
            - Explaining product features and specifications
            - Suggesting gift ideas
            - Helping during checkout (payment methods, delivery info)
            - Answering return and delivery policy questions
            - Summarizing reviews and helping make purchase decisions

            Return and Delivery Policy:
            - Free delivery on orders above ₹499
            - Standard delivery: 3-5 business days
            - Returns accepted within 7 days of delivery
            - Refunds processed in 5-7 business days

            Always be friendly, concise, and helpful. Format responses clearly with bullet points when listing items.
            When asked about specific products, provide helpful comparisons and recommendations.
            """;

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }

    public String askAI(String prompt) {
        logger.info("Shopping assistant query: {}", prompt);
        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            logger.info("Assistant response received");
            return response;
        } catch (Exception e) {
            logger.error("Error calling AI: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get response from AI: " + e.getMessage(), e);
        }
    }

    public String summarizeReviews(String productName, String reviews) {
        String prompt = String.format(
                "Summarize these customer reviews for '%s'. Provide: positive points, negative points, and overall verdict.\n\nReviews:\n%s",
                productName, reviews);
        return askAI(prompt);
    }

    public String getSmartSearchQuery(String userInput) {
        String prompt = String.format(
                "Convert this natural language shopping query into structured search terms. " +
                "Return only: category, keywords, maxPrice (if mentioned). " +
                "Input: '%s'", userInput);
        return askAI(prompt);
    }
}
