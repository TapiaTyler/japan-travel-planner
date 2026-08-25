package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LodgingResponse {

    private Long id;
    private String itemType;
    private String name;
    private LocalDate date;
    private Long cost;
    private CostStatus costStatus;
    private String notes;
    private String location;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long numberOfNights;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LodgingResponse() {

    }

    public LodgingResponse(
            Long id,
            String itemType,
            String name,
            LocalDate date,
            Long cost,
            CostStatus costStatus,
            String notes,
            String location,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            Long numberOfNights,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.itemType = itemType;
        this.name = name;
        this.date = date;
        this.cost = cost;
        this.costStatus = costStatus;
        this.notes = notes;
        this.location = location;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfNights = numberOfNights;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getItemType() {
        return itemType;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getCost() {
        return cost;
    }

    public CostStatus getCostStatus() {
        return costStatus;
    }

    public String getNotes() {
        return notes;
    }

    public String getLocation() {
        return location;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public Long getNumberOfNights() {
        return numberOfNights;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}