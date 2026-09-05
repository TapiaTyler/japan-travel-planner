package com.japantravelplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class InstantiateTripTemplateRequest {

    @NotBlank(message = "Trip name is required.")
    @Size(max = 100, message = "Trip name must be 100 characters or fewer.")
    private String name;

    @NotNull(message = "Start date is required.")
    private LocalDate startDate;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
}
