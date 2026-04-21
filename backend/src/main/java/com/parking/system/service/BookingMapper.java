package com.parking.system.service;

import com.parking.system.dto.BookingResponse;
import com.parking.system.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                new BookingResponse.UserSummary(
                        booking.getUser().getId(),
                        booking.getUser().getName(),
                        booking.getUser().getEmail()),
                new BookingResponse.SlotSummary(
                        booking.getSlot().getId(),
                        booking.getSlot().getSlotNumber(),
                        booking.getSlot().getType().name(),
                        booking.getSlot().getStatus().name()),
                booking.getVehicleNumber(),
                booking.getEntryTime(),
                booking.getExitTime(),
                booking.getAmount(),
                booking.getStatus().name());
    }
}
