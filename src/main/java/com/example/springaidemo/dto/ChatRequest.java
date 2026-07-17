package com.example.springaidemo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Chat Request
 * Contains the user's message to be sent to the AI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    /**
     * The message from the user
     * Cannot be blank or empty
     */
    @NotBlank(message = "Message cannot be blank")
    private String message;
}
