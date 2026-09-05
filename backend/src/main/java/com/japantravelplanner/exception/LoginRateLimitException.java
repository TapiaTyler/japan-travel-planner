package com.japantravelplanner.exception;

public class LoginRateLimitException extends ApiException {

    public LoginRateLimitException() {
        super(ApiErrorCode.AUTH_RATE_LIMITED);
    }
}
