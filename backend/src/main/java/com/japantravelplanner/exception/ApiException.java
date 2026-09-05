package com.japantravelplanner.exception;

public class ApiException extends IllegalArgumentException {
    private final ApiErrorCode code;

    public ApiException(ApiErrorCode code) {
        super(code.getDefaultMessage());
        this.code = code;
    }

    public ApiErrorCode getCode() {
        return code;
    }
}
