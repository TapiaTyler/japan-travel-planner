package com.japantravelplanner.service;

import com.japantravelplanner.exception.LoginRateLimitException;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LoginAttemptServiceTest {

    private final Clock clock = Clock.fixed(
            Instant.parse("2027-01-01T00:00:00Z"),
            ZoneOffset.UTC
    );

    @Test
    void blocksNormalizedUsernameAtConfiguredThreshold() {
        LoginAttemptService service = createService(2, 10);

        service.recordFailure("Traveler", "192.0.2.1");
        service.recordFailure(" traveler ", "192.0.2.2");

        assertThrows(
                LoginRateLimitException.class,
                () -> service.checkAllowed("TRAVELER", "192.0.2.3")
        );
    }

    @Test
    void blocksAnIpAcrossDifferentUsernames() {
        LoginAttemptService service = createService(10, 2);

        service.recordFailure("first", "192.0.2.1");
        service.recordFailure("second", "192.0.2.1");

        assertThrows(
                LoginRateLimitException.class,
                () -> service.checkAllowed("third", "192.0.2.1")
        );
    }

    @Test
    void successfulLoginCanClearUsernameFailures() {
        LoginAttemptService service = createService(2, 10);

        service.recordFailure("traveler", "192.0.2.1");
        service.recordFailure("traveler", "192.0.2.2");
        service.clearUsernameFailures("traveler");

        assertDoesNotThrow(
                () -> service.checkAllowed("traveler", "192.0.2.3")
        );
    }

    private LoginAttemptService createService(int usernameLimit, int ipLimit) {
        return new LoginAttemptService(
                usernameLimit,
                ipLimit,
                Duration.ofMinutes(15),
                100,
                clock
        );
    }
}
