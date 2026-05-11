package com.campus.userservice.exception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.campus.userservice.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 🔴 Validation Errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException ex) {
    	log.error("🔥 Validation Exception: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        return ApiResponse.error(400, "Validation failed", errors);
    }

    // 🔴 Duplicate Resource
    @ExceptionHandler(DuplicateResourceException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<?> handleDuplicate(DuplicateResourceException ex) {
        return ApiResponse.error(409, ex.getMessage(), null);
    }

    // 🔴 Bad Request
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleBadRequest(BadRequestException ex) {
        return ApiResponse.error(400, ex.getMessage(), null);
    }

    // 🔴 Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<?> handleNotFound(ResourceNotFoundException ex) {
        return ApiResponse.error(404, ex.getMessage(), null);
    }

    // 🔴 Unauthorized
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<?> handleUnauthorized(UnauthorizedException ex) {
        return ApiResponse.error(401, ex.getMessage(), null);
    }

    // 🔴 Generic Exception (Fallback)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleGeneric(Exception ex) {
        log.error("🔥 Unexpected error: {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
        return ApiResponse.error(500, "Internal Server Error: " + ex.getMessage(), null);
    }
}
