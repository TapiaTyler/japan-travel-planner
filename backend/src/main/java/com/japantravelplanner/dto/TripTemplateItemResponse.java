package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;
import com.japantravelplanner.model.TransportationType;

import java.time.LocalTime;

public class TripTemplateItemResponse {
    private final Long id;
    private final String itemType;
    private final String name;
    private final Integer dateOffset;
    private final Long cost;
    private final CostStatus costStatus;
    private final String notes;
    private final String mapSearchQuery;
    private final String location;
    private final LocalTime startTime;
    private final LocalTime endTime;
    private final TransportationType transportationType;
    private final String departureLocation;
    private final String arrivalLocation;
    private final Integer departureDateOffset;
    private final LocalTime departureTime;
    private final Integer arrivalDateOffset;
    private final LocalTime arrivalTime;
    private final Integer checkInDateOffset;
    private final Integer checkOutDateOffset;

    public TripTemplateItemResponse(
            Long id, String itemType, String name, Integer dateOffset,
            Long cost, CostStatus costStatus, String notes, String mapSearchQuery,
            String location, LocalTime startTime, LocalTime endTime,
            TransportationType transportationType, String departureLocation,
            String arrivalLocation, Integer departureDateOffset,
            LocalTime departureTime, Integer arrivalDateOffset,
            LocalTime arrivalTime, Integer checkInDateOffset,
            Integer checkOutDateOffset) {
        this.id = id;
        this.itemType = itemType;
        this.name = name;
        this.dateOffset = dateOffset;
        this.cost = cost;
        this.costStatus = costStatus;
        this.notes = notes;
        this.mapSearchQuery = mapSearchQuery;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.transportationType = transportationType;
        this.departureLocation = departureLocation;
        this.arrivalLocation = arrivalLocation;
        this.departureDateOffset = departureDateOffset;
        this.departureTime = departureTime;
        this.arrivalDateOffset = arrivalDateOffset;
        this.arrivalTime = arrivalTime;
        this.checkInDateOffset = checkInDateOffset;
        this.checkOutDateOffset = checkOutDateOffset;
    }

    public Long getId() { return id; }
    public String getItemType() { return itemType; }
    public String getName() { return name; }
    public Integer getDateOffset() { return dateOffset; }
    public Long getCost() { return cost; }
    public CostStatus getCostStatus() { return costStatus; }
    public String getNotes() { return notes; }
    public String getMapSearchQuery() { return mapSearchQuery; }
    public String getLocation() { return location; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public TransportationType getTransportationType() { return transportationType; }
    public String getDepartureLocation() { return departureLocation; }
    public String getArrivalLocation() { return arrivalLocation; }
    public Integer getDepartureDateOffset() { return departureDateOffset; }
    public LocalTime getDepartureTime() { return departureTime; }
    public Integer getArrivalDateOffset() { return arrivalDateOffset; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public Integer getCheckInDateOffset() { return checkInDateOffset; }
    public Integer getCheckOutDateOffset() { return checkOutDateOffset; }
}
