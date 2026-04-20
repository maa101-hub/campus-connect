package com.campus.userservice.dto;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
@NotBlank(message = "Email is required")
private String email;

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

}
