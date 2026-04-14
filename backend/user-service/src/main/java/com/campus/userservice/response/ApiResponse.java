package com.campus.userservice.response;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private LocalDateTime timestamp;
    private int status;
    private String message;
    private T data;
    private Object errors;

    // 🔹 Constructors
    public ApiResponse() {}

    public ApiResponse(LocalDateTime timestamp, int status, String message, T data, Object errors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    // 🔹 Static Success Response
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                200,
                message,
                data,
                null
        );
    }

    // 🔹 Static Error Response
    public static <T> ApiResponse<T> error(int status, String message, Object errors) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                status,
                message,
                null,
                errors
        );
    }

    // 🔹 Getters & Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Object getErrors() {
        return errors;
    }

    public void setErrors(Object errors) {
        this.errors = errors;
    }
}