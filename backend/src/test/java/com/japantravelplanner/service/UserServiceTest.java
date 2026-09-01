package com.japantravelplanner.service;

// Imports
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    // Tests
    @Test
    void registerUserCreatesUser() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password"))
                .thenReturn("hashedPassword");

        UserService userService =
                new UserService(userRepository, passwordEncoder);

        User savedUser =
                new User("testuser", "hashedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        User result =
                userService.registerUser(
                        "testuser",
                        "password"
                );

        assertEquals("testuser", result.getUsername());
    }

    @Test
    void registerUserRejectsDuplicateUsername() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(
                        Optional.of(
                                new User(
                                        "testuser",
                                        "hashedPassword"
                                )
                        )
                );

        UserService userService =
                new UserService(userRepository, passwordEncoder);

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.registerUser(
                        "testuser",
                        "password"
                )
        );
    }
}