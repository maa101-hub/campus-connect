package com.campus.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String username;
    private String collegeName;
    private boolean emailVerified;
    
    // Advanced Profile Info
    private String bio;
    private String major;
    private String yearOfStudy;
    private String skills;
    private String interests;
}
