package com.example.springaidemo.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler for the application
 * Handles various exceptions and returns proper JSON responses
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * Handles RuntimeException
     * @param ex The runtime exception
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        logger.error("RuntimeException occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage(),
                LocalDateTime.now()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Handles IllegalArgumentException
     * @param ex The illegal argument exception
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("IllegalArgumentException occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                LocalDateTime.now()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles validation errors
     * @param ex The method argument not valid exception
     * @return ResponseEntity with validation error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        logger.error("Validation error occurred: {}", ex.getMessage(), ex);
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                errors.toString(),
                LocalDateTime.now()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles all other exceptions
     * @param ex The exception
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Exception occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred",
                LocalDateTime.now()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Inner class for error response structure
     */
    public static class ErrorResponse {
        private int status;
        private String error;
        private String message;
        private LocalDateTime timestamp;
        
        public ErrorResponse(int status, String error, String message, LocalDateTime timestamp) {
            this.status = status;
            this.error = error;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters
        public int getStatus() {
            return status;
        }
        
        public String getError() {
            return error;
        }
        
        public String getMessage() {
            return message;
        }
        
        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }
}
