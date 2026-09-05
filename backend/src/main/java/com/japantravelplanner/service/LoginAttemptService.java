package com.japantravelplanner.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.japantravelplanner.exception.LoginRateLimitException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Locale;

@Service
public class LoginAttemptService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginAttemptService.class);

    private final int usernameLimit;
    private final int ipLimit;
    private final Duration observationWindow;
    private final Clock clock;
    private final Cache<String, AttemptWindow> usernameAttempts;
    private final Cache<String, AttemptWindow> ipAttempts;

    @Autowired
    public LoginAttemptService(
            @Value("${app.security.login.username-attempt-limit:5}") int usernameLimit,
            @Value("${app.security.login.ip-attempt-limit:25}") int ipLimit,
            @Value("${app.security.login.observation-window-minutes:15}") long observationWindowMinutes,
            @Value("${app.security.login.max-tracked-keys:10000}") long maxTrackedKeys) {

        this(
                usernameLimit,
                ipLimit,
                Duration.ofMinutes(observationWindowMinutes),
                maxTrackedKeys,
                Clock.systemUTC()
        );
    }

    LoginAttemptService(
            int usernameLimit,
            int ipLimit,
            Duration observationWindow,
            long maxTrackedKeys,
            Clock clock) {

        this.usernameLimit = usernameLimit;
        this.ipLimit = ipLimit;
        this.observationWindow = observationWindow;
        this.clock = clock;

        Duration cacheLifetime = observationWindow.multipliedBy(2);
        this.usernameAttempts = buildCache(maxTrackedKeys, cacheLifetime);
        this.ipAttempts = buildCache(maxTrackedKeys, cacheLifetime);
    }

    public void checkAllowed(String username, String clientIp) {
        Instant now = clock.instant();

        if (isBlocked(usernameAttempts, normalizeUsername(username), usernameLimit, now)
                || isBlocked(ipAttempts, normalizeIp(clientIp), ipLimit, now)) {
            LOGGER.warn("Login rate limit exceeded for a username or client IP.");
            throw new LoginRateLimitException();
        }
    }

    public void recordFailure(String username, String clientIp) {
        Instant now = clock.instant();

        record(usernameAttempts, normalizeUsername(username), now);
        record(ipAttempts, normalizeIp(clientIp), now);
    }

    public void clearUsernameFailures(String username) {
        usernameAttempts.invalidate(normalizeUsername(username));
    }

    private Cache<String, AttemptWindow> buildCache(long maximumSize, Duration lifetime) {
        return Caffeine.newBuilder()
                .maximumSize(maximumSize)
                .expireAfterAccess(lifetime)
                .build();
    }

    private boolean isBlocked(
            Cache<String, AttemptWindow> cache,
            String key,
            int limit,
            Instant now) {

        AttemptWindow attempts = cache.getIfPresent(key);
        return attempts != null && attempts.countSince(now.minus(observationWindow)) >= limit;
    }

    private void record(Cache<String, AttemptWindow> cache, String key, Instant now) {
        AttemptWindow attempts = cache.get(key, ignored -> new AttemptWindow());
        attempts.add(now, now.minus(observationWindow));
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeIp(String clientIp) {
        return clientIp == null || clientIp.isBlank() ? "unknown" : clientIp;
    }

    private static final class AttemptWindow {
        private final Deque<Instant> failures = new ArrayDeque<>();

        synchronized void add(Instant failure, Instant cutoff) {
            removeOlderThan(cutoff);
            failures.addLast(failure);
        }

        synchronized int countSince(Instant cutoff) {
            removeOlderThan(cutoff);
            return failures.size();
        }

        private void removeOlderThan(Instant cutoff) {
            while (!failures.isEmpty() && failures.peekFirst().isBefore(cutoff)) {
                failures.removeFirst();
            }
        }
    }
}
