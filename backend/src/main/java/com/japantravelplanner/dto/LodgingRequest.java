package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class LodgingRequest {

    @NotBlank(message = "Lodging name is required.")
    @Size(max = 100, message = "Lodging name must be 100 characters or fewer.")
    private String name;

    private Long cost;
    private CostStatus costStatus;

    @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
    private String notes;

    private String location;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    public LodgingRequest() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCost() {
        return cost;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }

    public CostStatus getCostStatus() {
        return costStatus;
    }

    public void setCostStatus(CostStatus costStatus) {
        this.costStatus = costStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }
}