package com.japantravelplanner.exception;

import com.japantravelplanner.dto.ApiErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void returnsStableCodeAndCompatibleMessageForDomainErrors() {
        ResponseEntity<ApiErrorResponse> response = handler.handleApiException(
                new ApiException(ApiErrorCode.TRIP_DATES_INVALID)
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("TRIP_DATES_INVALID", response.getBody().code());
        assertEquals("Start date cannot be after end date.", response.getBody().message());
    }

    @Test
    void returnsNotFoundForUnavailableTemplates() {
        ResponseEntity<ApiErrorResponse> response = handler.handleApiException(
                new ApiException(ApiErrorCode.TEMPLATE_NOT_FOUND)
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("TEMPLATE_NOT_FOUND", response.getBody().code());
    }

    @Test
    void returnsStableCodeForRateLimitedLogins() {
        ResponseEntity<ApiErrorResponse> response = handler.handleLoginRateLimitException(
                new LoginRateLimitException()
        );

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("AUTH_RATE_LIMITED", response.getBody().code());
        assertEquals("no-store", response.getHeaders().getCacheControl());
    }

    @Test
    void returnsStableFieldCodesForValidationErrors() {
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError usernameError = new FieldError(
                "registerRequest",
                "username",
                null,
                false,
                new String[]{"NotBlank"},
                null,
                "Username is required."
        );
        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(usernameError));

        ResponseEntity<ApiErrorResponse> response = handler.handleValidationException(exception);

        assertNotNull(response.getBody());
        assertEquals("VALIDATION_FAILED", response.getBody().code());
        assertEquals(
                "VALIDATION_USERNAME_NOT_BLANK",
                response.getBody().fieldErrors().get("username")
        );
    }
}
