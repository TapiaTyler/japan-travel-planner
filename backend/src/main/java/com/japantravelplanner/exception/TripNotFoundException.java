package com.japantravelplanner.exception;

public class TripNotFoundException extends RuntimeException {

    public TripNotFoundException() {

        super("The requested trip could not be found.");
    }

}
