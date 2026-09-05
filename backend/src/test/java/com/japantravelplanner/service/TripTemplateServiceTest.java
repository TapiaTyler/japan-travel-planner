package com.japantravelplanner.service;

import com.japantravelplanner.dto.InstantiateTripTemplateRequest;
import com.japantravelplanner.exception.ApiException;
import com.japantravelplanner.model.Activity;
import com.japantravelplanner.model.CostStatus;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.model.TripTemplate;
import com.japantravelplanner.model.TripTemplateItem;
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import com.japantravelplanner.repository.TripTemplateItemRepository;
import com.japantravelplanner.repository.TripTemplateRepository;
import com.japantravelplanner.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TripTemplateServiceTest {

    @Mock private TripTemplateRepository templateRepository;
    @Mock private TripTemplateItemRepository templateItemRepository;
    @Mock private TripRepository tripRepository;
    @Mock private TripItemRepository tripItemRepository;
    @Mock private UserRepository userRepository;
    @Mock private TripTemplateContentLocalizer contentLocalizer;

    @InjectMocks private TripTemplateService templateService;

    @BeforeEach
    void preserveStoredContentWhenNoTranslationIsStubbed() {
        lenient().when(contentLocalizer.localize(
                        any(), anyString(), any(), any(Locale.class)))
                .thenAnswer(invocation -> invocation.getArgument(2));
    }

    @Test
    void instantiateShiftsRelativeDatesAndPreservesMapLocation() {
        TripTemplate template = org.mockito.Mockito.mock(TripTemplate.class);
        when(template.isPublicTemplate()).thenReturn(true);
        when(template.getDurationDays()).thenReturn(3);
        when(template.getNotes()).thenReturn("A reusable plan");
        when(templateRepository.findById(7L)).thenReturn(Optional.of(template));
        when(userRepository.findByUsername("traveler"))
                .thenReturn(Optional.of(new User("traveler", "hash")));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TripTemplateItem item = new TripTemplateItem();
        item.setItemType("Activity");
        item.setName("Senso-ji");
        item.setDateOffset(1);
        item.setLocation("Asakusa");
        item.setCost(500L);
        item.setCostStatus(CostStatus.CONFIRMED);
        item.setMapSearchQuery("Senso-ji Temple");
        when(templateItemRepository.findByTemplate_IdOrderByIdAsc(7L))
                .thenReturn(List.of(item));

        InstantiateTripTemplateRequest request = new InstantiateTripTemplateRequest();
        request.setName("Autumn Tokyo");
        request.setStartDate(LocalDate.of(2027, 10, 4));

        Trip result = templateService.instantiate(
                7L, "traveler", request, Locale.ENGLISH);

        assertEquals(LocalDate.of(2027, 10, 6), result.getEndDate());
        assertEquals("A reusable plan", result.getNotes());

        ArgumentCaptor<com.japantravelplanner.model.TripItem> itemCaptor =
                ArgumentCaptor.forClass(com.japantravelplanner.model.TripItem.class);
        verify(tripItemRepository).save(itemCaptor.capture());
        Activity created = (Activity) itemCaptor.getValue();
        assertEquals(LocalDate.of(2027, 10, 5), created.getDate());
        assertEquals("Senso-ji Temple", created.getMapSearchQuery());
    }

    @Test
    void instantiateHidesAnotherUsersPrivateTemplate() {
        TripTemplate template = org.mockito.Mockito.mock(TripTemplate.class);
        User owner = new User("owner", "hash");
        when(template.isPublicTemplate()).thenReturn(false);
        when(template.getOwner()).thenReturn(owner);
        when(templateRepository.findById(9L)).thenReturn(Optional.of(template));

        InstantiateTripTemplateRequest request = new InstantiateTripTemplateRequest();
        request.setName("Private copy");
        request.setStartDate(LocalDate.of(2027, 1, 1));

        assertThrows(
                ApiException.class,
                () -> templateService.instantiate(
                        9L, "visitor", request, Locale.ENGLISH)
        );
        verify(tripRepository, never()).save(any());
    }

    @Test
    void instantiateUsesLocalizedContentForPublicTemplate() {
        TripTemplate template = org.mockito.Mockito.mock(TripTemplate.class);
        when(template.isPublicTemplate()).thenReturn(true);
        when(template.getPublicKey()).thenReturn("tokyo-highlights");
        when(template.getDurationDays()).thenReturn(1);
        when(template.getNotes()).thenReturn("Tokyo introduction");
        when(templateRepository.findById(4L)).thenReturn(Optional.of(template));
        when(userRepository.findByUsername("traveler"))
                .thenReturn(Optional.of(new User("traveler", "hash")));
        when(tripRepository.save(any(Trip.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TripTemplateItem item = new TripTemplateItem();
        item.setItemType("Activity");
        item.setName("Meiji Jingu");
        item.setLocalizationKey("tokyo-highlights.meiji-jingu");
        item.setDateOffset(0);
        item.setLocation("Shibuya");
        item.setCostStatus(CostStatus.UNKNOWN);
        when(templateItemRepository.findByTemplate_IdOrderByIdAsc(4L))
                .thenReturn(List.of(item));

        when(contentLocalizer.localize(
                "tokyo-highlights", "notes", "Tokyo introduction", Locale.JAPANESE))
                .thenReturn("東京の入門プランです。");
        when(contentLocalizer.localize(
                "tokyo-highlights.meiji-jingu", "name", "Meiji Jingu", Locale.JAPANESE))
                .thenReturn("明治神宮");
        when(contentLocalizer.localize(
                "tokyo-highlights.meiji-jingu", "location", "Shibuya", Locale.JAPANESE))
                .thenReturn("渋谷");

        InstantiateTripTemplateRequest request = new InstantiateTripTemplateRequest();
        request.setName("東京旅行");
        request.setStartDate(LocalDate.of(2027, 4, 1));

        Trip result = templateService.instantiate(
                4L, "traveler", request, Locale.JAPANESE);

        assertEquals("東京の入門プランです。", result.getNotes());
        ArgumentCaptor<com.japantravelplanner.model.TripItem> itemCaptor =
                ArgumentCaptor.forClass(com.japantravelplanner.model.TripItem.class);
        verify(tripItemRepository).save(itemCaptor.capture());
        Activity created = (Activity) itemCaptor.getValue();
        assertEquals("明治神宮", created.getName());
        assertEquals("渋谷", created.getLocation());
    }
}
