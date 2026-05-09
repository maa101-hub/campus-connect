package com.campus.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    private String bio;
    private String major;
    private String yearOfStudy;
    private String skills;
    private String interests;
}
