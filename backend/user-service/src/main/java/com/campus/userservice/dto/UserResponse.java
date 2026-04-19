package com.campus.userservice.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String username;
    private String collegeName;
    private boolean emailVerified;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email,
                        String username, String collegeName,
                        boolean emailVerified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.collegeName = collegeName;
        this.emailVerified = emailVerified;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
}
