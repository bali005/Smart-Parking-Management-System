package com.parking.system.dto;

public class ExitResponse {
    private BookingResponse booking;
    private String message;

    public ExitResponse(BookingResponse booking, String message) {
        this.booking = booking;
        this.message = message;
    }

    public BookingResponse getBooking() { return booking; }
    public String getMessage() { return message; }
}
