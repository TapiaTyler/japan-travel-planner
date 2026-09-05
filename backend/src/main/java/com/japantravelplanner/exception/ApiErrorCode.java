package com.japantravelplanner.exception;

public enum ApiErrorCode {
    AUTH_INVALID_CREDENTIALS("Invalid username or password."),
    AUTH_RATE_LIMITED("Too many login attempts. Please try again later."),
    USERNAME_ALREADY_EXISTS("Username is already in use."),
    CURRENT_PASSWORD_INCORRECT("Current password is incorrect."),
    TRIP_NOT_FOUND("The requested trip could not be found."),
    TRIP_DATES_INVALID("Start date cannot be after end date."),
    TEMPLATE_NOT_FOUND("The requested trip template could not be found."),
    ITEM_NOT_FOUND("The requested itinerary item could not be found."),
    ITEM_TYPE_UNSUPPORTED("Unsupported itinerary item type."),
    ITEM_NOT_ACTIVITY("The requested itinerary item is not an activity."),
    ITEM_NOT_TRANSPORTATION("The requested itinerary item is not transportation."),
    ITEM_NOT_LODGING("The requested itinerary item is not lodging."),
    ITEM_DATE_OUTSIDE_TRIP("The item date must fall within the trip dates."),
    ACTIVITY_TIME_INVALID("Activity end time cannot be before the start time."),
    TRANSPORTATION_DATE_INVALID("Transportation arrival date cannot be before the departure date."),
    TRANSPORTATION_TIME_INVALID("Transportation arrival time cannot be before the departure time."),
    LODGING_DATES_INVALID("Lodging check-out date cannot be before the check-in date."),
    COST_NEGATIVE("Cost cannot be negative."),
    COST_REQUIRED_FOR_STATUS("A cost is required when the cost status is Confirmed or Estimated."),
    VALIDATION_FAILED("The submitted information is invalid.");

    private final String defaultMessage;

    ApiErrorCode(String defaultMessage) {
        this.defaultMessage = defaultMessage;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
