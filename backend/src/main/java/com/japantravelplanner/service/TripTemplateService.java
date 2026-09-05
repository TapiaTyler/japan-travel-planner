package com.japantravelplanner.service;

import com.japantravelplanner.dto.*;
import com.japantravelplanner.exception.ApiErrorCode;
import com.japantravelplanner.exception.ApiException;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class TripTemplateService {

    private final TripTemplateRepository templateRepository;
    private final TripTemplateItemRepository templateItemRepository;
    private final TripRepository tripRepository;
    private final TripItemRepository tripItemRepository;
    private final UserRepository userRepository;

    public TripTemplateService(
            TripTemplateRepository templateRepository,
            TripTemplateItemRepository templateItemRepository,
            TripRepository tripRepository,
            TripItemRepository tripItemRepository,
            UserRepository userRepository) {
        this.templateRepository = templateRepository;
        this.templateItemRepository = templateItemRepository;
        this.tripRepository = tripRepository;
        this.tripItemRepository = tripItemRepository;
        this.userRepository = userRepository;
    }

    public List<TripTemplateResponse> getPublicTemplates() {
        return templateRepository.findByPublicTemplateTrueOrderByNameAsc()
                .stream().map(this::toResponse).toList();
    }

    public TripTemplateResponse getPublicTemplate(Long templateId) {
        TripTemplate template = templateRepository.findById(templateId)
                .filter(TripTemplate::isPublicTemplate)
                .orElseThrow(() -> new ApiException(ApiErrorCode.TEMPLATE_NOT_FOUND));
        return toResponse(template);
    }

    public List<TripTemplateResponse> getOwnedTemplates(String username) {
        return templateRepository.findByOwner_UsernameOrderByCreatedAtDesc(username)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TripTemplateResponse createFromTrip(
            Long tripId,
            String username,
            CreateTripTemplateRequest request) {
        Trip trip = tripRepository.findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        int durationDays = Math.toIntExact(
                ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1
        );
        TripTemplate template = templateRepository.save(new TripTemplate(
                trip.getUser(), request.getName().trim(), durationDays, request.getNotes()
        ));

        List<TripTemplateItem> snapshots = tripItemRepository.findByTrip_Id(tripId)
                .stream()
                .map(item -> toTemplateItem(item, template, trip.getStartDate()))
                .toList();
        templateItemRepository.saveAll(snapshots);

        return toResponse(template);
    }

    @Transactional
    public Trip instantiate(
            Long templateId,
            String username,
            InstantiateTripTemplateRequest request) {
        TripTemplate template = getAccessibleTemplate(templateId, username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User account could not be found."));

        LocalDate endDate = request.getStartDate().plusDays(template.getDurationDays() - 1L);
        Trip trip = tripRepository.save(new Trip(
                user, request.getName().trim(), request.getStartDate(), endDate, template.getNotes()
        ));

        templateItemRepository.findByTemplate_IdOrderByIdAsc(templateId)
                .stream()
                .map(item -> toTripItem(item, trip, request.getStartDate()))
                .forEach(tripItemRepository::save);

        return trip;
    }

    @Transactional
    public void deleteOwnedTemplate(Long templateId, String username) {
        TripTemplate template = templateRepository
                .findByIdAndOwner_Username(templateId, username)
                .orElseThrow(() -> new ApiException(ApiErrorCode.TEMPLATE_NOT_FOUND));
        templateRepository.delete(template);
    }

    private TripTemplate getAccessibleTemplate(Long templateId, String username) {
        TripTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ApiException(ApiErrorCode.TEMPLATE_NOT_FOUND));
        if (!template.isPublicTemplate()
                && (template.getOwner() == null
                || !template.getOwner().getUsername().equals(username))) {
            throw new ApiException(ApiErrorCode.TEMPLATE_NOT_FOUND);
        }
        return template;
    }

    private TripTemplateItem toTemplateItem(
            TripItem item, TripTemplate template, LocalDate tripStart) {
        TripTemplateItem snapshot = new TripTemplateItem();
        snapshot.setTemplate(template);
        snapshot.setItemType(item.getItemType());
        snapshot.setName(item.getName());
        snapshot.setDateOffset(toOffset(tripStart, item.getDate()));
        snapshot.setCost(item.getCost());
        snapshot.setCostStatus(item.getCostStatus());
        snapshot.setNotes(item.getNotes());
        snapshot.setMapSearchQuery(item.getMapSearchQuery());

        if (item instanceof Activity activity) {
            snapshot.setLocation(activity.getLocation());
            snapshot.setStartTime(activity.getStartTime());
            snapshot.setEndTime(activity.getEndTime());
        } else if (item instanceof Transportation transportation) {
            snapshot.setTransportationType(transportation.getTransportationType());
            snapshot.setDepartureLocation(transportation.getDepartureLocation());
            snapshot.setArrivalLocation(transportation.getArrivalLocation());
            snapshot.setDepartureDateOffset(toOffset(tripStart, transportation.getDepartureDate()));
            snapshot.setDepartureTime(transportation.getDepartureTime());
            snapshot.setArrivalDateOffset(toOffset(tripStart, transportation.getArrivalDate()));
            snapshot.setArrivalTime(transportation.getArrivalTime());
        } else if (item instanceof Lodging lodging) {
            snapshot.setLocation(lodging.getLocation());
            snapshot.setCheckInDateOffset(toOffset(tripStart, lodging.getCheckInDate()));
            snapshot.setCheckOutDateOffset(toOffset(tripStart, lodging.getCheckOutDate()));
        } else {
            throw new ApiException(ApiErrorCode.ITEM_TYPE_UNSUPPORTED);
        }
        return snapshot;
    }

    private TripItem toTripItem(
            TripTemplateItem item, Trip trip, LocalDate tripStart) {
        TripItem created;
        if ("Activity".equals(item.getItemType())) {
            created = new Activity(
                    trip, item.getName(), fromOffset(tripStart, item.getDateOffset()),
                    item.getCost(), item.getCostStatus(), item.getNotes(), item.getLocation(),
                    item.getStartTime(), item.getEndTime()
            );
        } else if ("Transportation".equals(item.getItemType())) {
            created = new Transportation(
                    trip, item.getName(), fromOffset(tripStart, item.getDateOffset()),
                    item.getCost(), item.getCostStatus(), item.getNotes(),
                    item.getTransportationType(), item.getDepartureLocation(), item.getArrivalLocation(),
                    fromOffset(tripStart, item.getDepartureDateOffset()), item.getDepartureTime(),
                    fromOffset(tripStart, item.getArrivalDateOffset()), item.getArrivalTime()
            );
        } else if ("Lodging".equals(item.getItemType())) {
            created = new Lodging(
                    trip, item.getName(), fromOffset(tripStart, item.getDateOffset()),
                    item.getCost(), item.getCostStatus(), item.getNotes(), item.getLocation(),
                    fromOffset(tripStart, item.getCheckInDateOffset()),
                    fromOffset(tripStart, item.getCheckOutDateOffset())
            );
        } else {
            throw new ApiException(ApiErrorCode.ITEM_TYPE_UNSUPPORTED);
        }
        created.setMapSearchQuery(item.getMapSearchQuery());
        return created;
    }

    private Integer toOffset(LocalDate start, LocalDate date) {
        return date == null ? null : Math.toIntExact(ChronoUnit.DAYS.between(start, date));
    }

    private LocalDate fromOffset(LocalDate start, Integer offset) {
        return offset == null ? null : start.plusDays(offset);
    }

    private TripTemplateResponse toResponse(TripTemplate template) {
        List<TripTemplateItem> items =
                templateItemRepository.findByTemplate_IdOrderByIdAsc(template.getId());
        Set<String> destinations = new LinkedHashSet<>();
        items.forEach(item -> {
            addDestination(destinations, item.getLocation());
            addDestination(destinations, item.getDepartureLocation());
            addDestination(destinations, item.getArrivalLocation());
        });
        List<TripTemplateItemResponse> itemResponses = items.stream()
                .map(this::toItemResponse).toList();
        long totalCost = items.stream().filter(item -> item.getCost() != null)
                .mapToLong(TripTemplateItem::getCost).sum();
        return new TripTemplateResponse(
                template.getId(), template.getName(), template.getDurationDays(),
                template.getNotes(), template.isPublicTemplate(), items.size(),
                List.copyOf(destinations), totalCost, itemResponses,
                template.getCreatedAt(), template.getUpdatedAt()
        );
    }

    private TripTemplateItemResponse toItemResponse(TripTemplateItem item) {
        return new TripTemplateItemResponse(
                item.getId(), item.getItemType(), item.getName(), item.getDateOffset(),
                item.getCost(), item.getCostStatus(), item.getNotes(), item.getMapSearchQuery(),
                item.getLocation(), item.getStartTime(), item.getEndTime(),
                item.getTransportationType(), item.getDepartureLocation(), item.getArrivalLocation(),
                item.getDepartureDateOffset(), item.getDepartureTime(), item.getArrivalDateOffset(),
                item.getArrivalTime(), item.getCheckInDateOffset(), item.getCheckOutDateOffset()
        );
    }

    private void addDestination(Set<String> destinations, String destination) {
        if (destination != null && !destination.isBlank()) destinations.add(destination.trim());
    }
}
