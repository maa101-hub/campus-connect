package com.campus.userservice.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
	private static final Logger log = LoggerFactory.getLogger(UserController.class);
	
    @GetMapping("/profile")
    public String profile() {
    	log.info("➡️ Accessing protected profile endpoint");
        return "Protected profile data";
    }
}