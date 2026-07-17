package com.example.springaidemo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Service class for handling AI chat operations
 * Uses Spring AI's ChatClient to interact with Groq API
 */
@Service
public class ChatService {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    
    private final ChatClient chatClient;
    
    /**
     * Constructor injection of ChatClient.Builder
     * @param chatClientBuilder Builder for creating ChatClient
     */
    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }
    
    /**
     * Sends a prompt to the AI and returns the response
     * @param prompt The user's message/question
     * @return The AI's response
     * @throws RuntimeException if the AI API call fails
     */
    public String askAI(String prompt) {
        logger.info("Sending prompt to AI: {}", prompt);
        
        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            
            logger.info("Received response from AI: {}", response);
            return response;
            
        } catch (Exception e) {
            logger.error("Error calling AI API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get response from AI: " + e.getMessage(), e);
        }
    }
}
