package com.japantravelplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters.")
    @Pattern(regexp = "^\\S+$", message = "Username cannot contain spaces.")
    private String username;

    @NotBlank(message = "Password is required.")
    @Size(min = 5, max = 100, message = "Password must be between 5 and 100 characters.")
    private String password;

    public RegisterRequest() {

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
