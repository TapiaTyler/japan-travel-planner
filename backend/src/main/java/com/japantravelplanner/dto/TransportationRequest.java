package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;
import com.japantravelplanner.model.TransportationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class TransportationRequest {

    @NotBlank(message = "Transportation name is required.")
    @Size(max = 100, message = "Transportation name must be 100 characters or fewer.")
    private String name;

    private Long cost;
    private CostStatus costStatus;

    @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
    private String notes;

    private TransportationType transportationType;

    private String departureLocation;
    private String arrivalLocation;

    private LocalDate departureDate;
    private LocalTime departureTime;

    private LocalDate arrivalDate;
    private LocalTime arrivalTime;

    public TransportationRequest() {

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

    public TransportationType getTransportationType() {
        return transportationType;
    }

    public void setTransportationType(TransportationType transportationType) {
        this.transportationType = transportationType;
    }

    public String getDepartureLocation() {
        return departureLocation;
    }

    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    public String getArrivalLocation() {
        return arrivalLocation;
    }

    public void setArrivalLocation(String arrivalLocation) {
        this.arrivalLocation = arrivalLocation;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}