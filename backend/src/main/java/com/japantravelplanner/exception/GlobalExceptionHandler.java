package com.japantravelplanner.exception;

import com.japantravelplanner.dto.ApiErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LoginRateLimitException.class)
    public ResponseEntity<ApiErrorResponse> handleLoginRateLimitException(
            LoginRateLimitException exception) {

        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(toResponse(exception));
    }

    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleTripNotFoundException(
            TripNotFoundException exception) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(toResponse(exception));
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException exception) {
        HttpStatus status = exception.getCode() == ApiErrorCode.TEMPLATE_NOT_FOUND
                || exception.getCode() == ApiErrorCode.LIBRARY_ITEM_NOT_FOUND
                ? HttpStatus.NOT_FOUND
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(toResponse(exception));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException exception) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiErrorResponse("BAD_REQUEST", "The request could not be completed.")
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            String constraint = error.getCode() == null ? "INVALID" : error.getCode();
            String code = "VALIDATION_"
                    + toUpperSnakeCase(error.getField())
                    + "_"
                    + toUpperSnakeCase(constraint);
            fieldErrors.putIfAbsent(error.getField(), code);
        });

        ApiErrorCode code = ApiErrorCode.VALIDATION_FAILED;
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiErrorResponse(code.name(), code.getDefaultMessage(), fieldErrors)
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(
            AuthenticationException exception) {

        ApiErrorCode code = ApiErrorCode.AUTH_INVALID_CREDENTIALS;
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiErrorResponse(code.name(), code.getDefaultMessage())
        );
    }

    private ApiErrorResponse toResponse(ApiException exception) {
        return new ApiErrorResponse(exception.getCode().name(), exception.getMessage());
    }

    private String toUpperSnakeCase(String value) {
        return value
                .replaceAll("([a-z0-9])([A-Z])", "$1_$2")
                .replaceAll("[^A-Za-z0-9]+", "_")
                .toUpperCase(Locale.ROOT);
    }
}
