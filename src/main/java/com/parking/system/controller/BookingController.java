package com.parking.system.controller;

import com.parking.system.dto.BookingRequest;
import com.parking.system.dto.BookingResponse;
import com.parking.system.dto.ExitResponse;
import com.parking.system.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<BookingResponse> getUserBookings(Authentication authentication) {
        return bookingService.getUserBookings(authentication.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> bookSlot(Authentication authentication, @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.bookSlot(authentication.getName(), request));
    }

    @PostMapping("/exit/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ExitResponse> exitSlot(@PathVariable Long id) {
        BookingResponse booking = bookingService.exitSlot(id);
        return ResponseEntity.ok(new ExitResponse(booking, "Parking exited successfully"));
    }
}
