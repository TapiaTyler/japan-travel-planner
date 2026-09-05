package com.japantravelplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTripTemplateRequest {

    @NotBlank(message = "Template name is required.")
    @Size(max = 100, message = "Template name must be 100 characters or fewer.")
    private String name;

    @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
    private String notes;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
