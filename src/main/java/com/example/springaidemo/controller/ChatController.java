package com.example.springaidemo.controller;

import com.example.springaidemo.dto.ChatRequest;
import com.example.springaidemo.dto.ChatResponse;
import com.example.springaidemo.service.ChatService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling chat requests
 * Provides GET and POST endpoints for AI chat functionality
 */
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    private final ChatService chatService;
    
    /**
     * Constructor injection of ChatService
     * @param chatService The chat service for AI operations
     */
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    /**
     * GET endpoint for chat
     * @param message The user's message as a query parameter
     * @return ChatResponse containing the question and answer
     */
    @GetMapping
    public ResponseEntity<ChatResponse> chatGet(@RequestParam String message) {
        logger.info("GET request received with message: {}", message);
        
        String answer = chatService.askAI(message);
        ChatResponse response = new ChatResponse(message, answer);
        
        logger.info("Sending response: {}", response);
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST endpoint for chat
     * @param chatRequest The chat request containing the message
     * @return ChatResponse containing the question and answer
     */
    @PostMapping
    public ResponseEntity<ChatResponse> chatPost(@Valid @RequestBody ChatRequest chatRequest) {
        logger.info("POST request received with message: {}", chatRequest.getMessage());
        
        String answer = chatService.askAI(chatRequest.getMessage());
        ChatResponse response = new ChatResponse(chatRequest.getMessage(), answer);
        
        logger.info("Sending response: {}", response);
        return ResponseEntity.ok(response);
    }
}
