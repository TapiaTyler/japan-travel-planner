package com.japantravelplanner.service;

import com.japantravelplanner.dto.SavedItineraryItemResponse;
import com.japantravelplanner.exception.ApiException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.SavedItineraryItemRepository;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavedItineraryItemServiceTest {

    @Mock private SavedItineraryItemRepository savedItemRepository;
    @Mock private TripRepository tripRepository;
    @Mock private TripItemRepository tripItemRepository;
    @Mock private TripItemService tripItemService;

    @InjectMocks private SavedItineraryItemService savedItemService;

    @Test
    void saveFromTripCreatesAnIndependentDateRelativeSnapshot() {
        User user = new User("traveler", "hash");
        Trip trip = new Trip(user, "Japan", LocalDate.of(2027, 4, 1),
                LocalDate.of(2027, 4, 10), null);
        trip.setId(4L);
        Lodging lodging = new Lodging(
                trip, "Kyoto Hotel", LocalDate.of(2027, 4, 3), 52000L,
                CostStatus.CONFIRMED, "Near the station", "Kyoto",
                LocalDate.of(2027, 4, 3), LocalDate.of(2027, 4, 6)
        );
        lodging.setMapSearchQuery("Kyoto Station");

        when(tripRepository.findByIdAndUser_Username(4L, "traveler"))
                .thenReturn(Optional.of(trip));
        when(tripItemRepository.findById(8L)).thenReturn(Optional.of(lodging));
        when(savedItemRepository.save(any(SavedItineraryItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SavedItineraryItemResponse result =
                savedItemService.saveFromTrip(4L, 8L, "traveler");

        assertEquals("Lodging", result.itemType());
        assertEquals(3, result.endDateOffset());
        assertEquals("Kyoto Station", result.mapSearchQuery());

        ArgumentCaptor<SavedItineraryItem> captor =
                ArgumentCaptor.forClass(SavedItineraryItem.class);
        verify(savedItemRepository).save(captor.capture());
        assertSame(user, captor.getValue().getOwner());
    }

    @Test
    void addToTripAppliesTheAnchorDateAndPreservedDuration() {
        SavedItineraryItem saved = new SavedItineraryItem();
        saved.setItemType("Transportation");
        saved.setName("Night Bus");
        saved.setTransportationType(TransportationType.BUS);
        saved.setDepartureLocation("Tokyo");
        saved.setArrivalLocation("Kyoto");
        saved.setDepartureTime(LocalTime.of(22, 0));
        saved.setArrivalTime(LocalTime.of(6, 0));
        saved.setEndDateOffset(1);
        saved.setMapSearchQuery("Kyoto Station");
        when(savedItemRepository.findByIdAndOwner_Username(3L, "traveler"))
                .thenReturn(Optional.of(saved));

        savedItemService.addToTrip(
                3L, 12L, LocalDate.of(2027, 5, 6), "traveler"
        );

        ArgumentCaptor<TripItem> captor = ArgumentCaptor.forClass(TripItem.class);
        verify(tripItemService).saveTripItem(
                org.mockito.ArgumentMatchers.eq(12L),
                org.mockito.ArgumentMatchers.eq("traveler"),
                captor.capture()
        );
        Transportation created = (Transportation) captor.getValue();
        assertEquals(LocalDate.of(2027, 5, 6), created.getDepartureDate());
        assertEquals(LocalDate.of(2027, 5, 7), created.getArrivalDate());
        assertEquals("Kyoto Station", created.getMapSearchQuery());
    }

    @Test
    void deleteDoesNotExposeAnotherUsersSavedItem() {
        when(savedItemRepository.findByIdAndOwner_Username(5L, "visitor"))
                .thenReturn(Optional.empty());

        assertThrows(
                ApiException.class,
                () -> savedItemService.deleteSavedItem(5L, "visitor")
        );
    }
}
