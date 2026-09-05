package com.japantravelplanner.exception;

public class TripNotFoundException extends ApiException {

    public TripNotFoundException() {

        super(ApiErrorCode.TRIP_NOT_FOUND);
    }

}
