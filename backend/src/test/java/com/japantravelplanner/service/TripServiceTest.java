package com.japantravelplanner.service;

// Imports
import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import com.japantravelplanner.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    // Mocks
    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TripItemRepository tripItemRepository;

    @Mock
    private TripRequest tripRequest;

    @InjectMocks
    private TripService tripService;

    // Tests
    @Test
    void createTripRejectsEndDateBeforeStartDate() {
        User user = new User(
                "testuser",
                "hashedPassword"
        );

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(user));

        when(tripRequest.getName())
                .thenReturn("Japan Trip");

        when(tripRequest.getStartDate())
                .thenReturn(LocalDate.of(2026, 10, 10));

        when(tripRequest.getEndDate())
                .thenReturn(LocalDate.of(2026, 10, 5));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> tripService.createTrip(
                                "testuser",
                                tripRequest
                        )
                );

        assertEquals(
                "Start date cannot be after end date.",
                exception.getMessage()
        );
    }

    @Test
    void getTripByIdReturnsTripOwnedByUser() {
        Trip trip = new Trip();

        when(
                tripRepository.findByIdAndUser_Username(
                        1L,
                        "testuser"
                )
        ).thenReturn(Optional.of(trip));

        Trip result = tripService.getTripById(
                1L,
                "testuser"
        );

        assertSame(trip, result);

        verify(tripRepository)
                .findByIdAndUser_Username(
                        1L,
                        "testuser"
                );
    }
}