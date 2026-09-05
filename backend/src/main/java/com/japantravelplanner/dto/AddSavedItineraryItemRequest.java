package com.japantravelplanner.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AddSavedItineraryItemRequest {

    @NotNull(message = "Date is required.")
    private LocalDate date;

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
