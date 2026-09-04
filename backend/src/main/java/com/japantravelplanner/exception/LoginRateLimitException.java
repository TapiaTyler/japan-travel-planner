package com.japantravelplanner.exception;

public class LoginRateLimitException extends RuntimeException {

    public LoginRateLimitException() {
        super("Too many login attempts. Please try again later.");
    }
}
