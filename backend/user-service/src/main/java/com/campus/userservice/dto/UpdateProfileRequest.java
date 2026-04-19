package com.campus.userservice.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateProfileRequest {
@NotBlank(message = "Name is required")
private String name;
@NotBlank(message = "Username is required")
private String username;
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name.trim();
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username.trim().toLowerCase();
}


}
