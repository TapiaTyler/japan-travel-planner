package com.japantravelplanner.service;

// Imports
import com.japantravelplanner.dto.ActivityRequest;
import com.japantravelplanner.model.Activity;
import com.japantravelplanner.model.CostStatus;
import com.japantravelplanner.model.Transportation;
import com.japantravelplanner.model.TransportationType;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.model.TripItem;
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TripItemServiceTest {

    // Mocks
    @Mock
    private TripItemRepository tripItemRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private ActivityRequest activityRequest;

    @InjectMocks
    private TripItemService tripItemService;

    // Tests
    @Test
    void createActivityStoresNormalizedMapSearchQuery() {
        User user = new User(
                "testuser",
                "hashedPassword"
        );

        Trip trip = new Trip(
                user,
                "Japan Trip",
                LocalDate.of(2026, 10, 10),
                LocalDate.of(2026, 10, 20),
                null
        );

        when(
                tripRepository.findByIdAndUser_Username(
                        1L,
                        "testuser"
                )
        ).thenReturn(Optional.of(trip));

        when(activityRequest.getName())
                .thenReturn("Tokyo Tower");
        when(activityRequest.getDate())
                .thenReturn(LocalDate.of(2026, 10, 11));
        when(activityRequest.getMapSearchQuery())
                .thenReturn("  Tokyo Tower, Tokyo  ");

        tripItemService.createActivity(
                1L,
                "testuser",
                activityRequest
        );

        ArgumentCaptor<Activity> activityCaptor =
                ArgumentCaptor.forClass(Activity.class);
        verify(tripItemRepository).save(activityCaptor.capture());

        assertEquals(
                "Tokyo Tower, Tokyo",
                activityCaptor.getValue().getMapSearchQuery()
        );
    }

    @Test
    void createActivityRejectsDateOutsideTripDates() {
        User user = new User(
                "testuser",
                "hashedPassword"
        );

        Trip trip = new Trip(
                user,
                "Japan Trip",
                LocalDate.of(2026, 10, 10),
                LocalDate.of(2026, 10, 20),
                null
        );

        when(
                tripRepository.findByIdAndUser_Username(
                        1L,
                        "testuser"
                )
        ).thenReturn(Optional.of(trip));

        when(activityRequest.getName())
                .thenReturn("Tokyo Tower");

        when(activityRequest.getDate())
                .thenReturn(
                        LocalDate.of(2026, 10, 25)
                );

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> tripItemService.createActivity(
                                1L,
                                "testuser",
                                activityRequest
                        )
                );

        assertEquals(
                "The item date must fall within the trip dates.",
                exception.getMessage()
        );
    }

    @Test
    void searchTripItemsMatchesLocationsAcrossItemTypes() {
        User user = new User(
                "testuser",
                "hashedPassword"
        );

        Trip trip = new Trip(
                user,
                "Japan Trip",
                LocalDate.of(2026, 10, 10),
                LocalDate.of(2026, 10, 20),
                null
        );

        Activity activity = new Activity(
                trip,
                "Tokyo Tower",
                LocalDate.of(2026, 10, 11),
                3000L,
                CostStatus.CONFIRMED,
                null,
                "Tokyo",
                null,
                null
        );

        Transportation transportation =
                new Transportation(
                        trip,
                        "Shinkansen",
                        LocalDate.of(2026, 10, 12),
                        14000L,
                        CostStatus.CONFIRMED,
                        null,
                        TransportationType.TRAIN,
                        "Tokyo Station",
                        "Kyoto Station",
                        LocalDate.of(2026, 10, 12),
                        null,
                        LocalDate.of(2026, 10, 12),
                        null
                );

        when(
                tripRepository.findByIdAndUser_Username(
                        1L,
                        "testuser"
                )
        ).thenReturn(Optional.of(trip));

        when(
                tripItemRepository.findByTrip_Id(1L)
        ).thenReturn(
                new ArrayList<>(
                        List.of(
                                activity,
                                transportation
                        )
                )
        );

        List<TripItem> results =
                tripItemService.searchTripItems(
                        1L,
                        "testuser",
                        "Tokyo"
                );

        assertEquals(2, results.size());

        assertTrue(
                results.contains(activity)
        );

        assertTrue(
                results.contains(transportation)
        );
    }
}
