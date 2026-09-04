package com.japantravelplanner.service;

// Imports
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.UserRepository;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
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
        TripRepository tripRepository = mock(TripRepository.class);
        TripItemRepository tripItemRepository = mock(TripItemRepository.class);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password"))
                .thenReturn("hashedPassword");

        UserService userService =
                new UserService(userRepository, passwordEncoder, tripRepository, tripItemRepository);

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
        TripRepository tripRepository = mock(TripRepository.class);
        TripItemRepository tripItemRepository = mock(TripItemRepository.class);

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
                new UserService(userRepository, passwordEncoder, tripRepository, tripItemRepository);

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.registerUser(
                        "testuser",
                        "password"
                )
        );
    }

    @Test
    void changePasswordRequiresCurrentPassword() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        TripRepository tripRepository = mock(TripRepository.class);
        TripItemRepository tripItemRepository = mock(TripItemRepository.class);
        User user = new User("testuser", "oldHash");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("currentPassword", "oldHash")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newHash");

        UserService userService = new UserService(
                userRepository, passwordEncoder, tripRepository, tripItemRepository);

        userService.changePassword("testuser", "currentPassword", "newPassword");

        assertEquals("newHash", user.getPasswordHash());
        verify(userRepository).save(user);
    }

    @Test
    void deleteAccountRemovesOwnedDataBeforeUser() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        TripRepository tripRepository = mock(TripRepository.class);
        TripItemRepository tripItemRepository = mock(TripItemRepository.class);
        User user = new User("testuser", "hash");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hash")).thenReturn(true);

        UserService userService = new UserService(
                userRepository, passwordEncoder, tripRepository, tripItemRepository);

        userService.deleteAccount("testuser", "password");

        var inOrder = inOrder(tripItemRepository, tripRepository, userRepository);
        inOrder.verify(tripItemRepository).deleteByTrip_User_Username("testuser");
        inOrder.verify(tripRepository).deleteByUser_Username("testuser");
        inOrder.verify(userRepository).delete(user);
    }
}
