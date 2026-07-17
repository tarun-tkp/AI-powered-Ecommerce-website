package com.example.springaidemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Chat Response
 * Contains the question and answer from the AI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    /**
     * The original question/message from the user
     */
    private String question;
    
    /**
     * The answer/response from the AI
     */
    private String answer;
}
