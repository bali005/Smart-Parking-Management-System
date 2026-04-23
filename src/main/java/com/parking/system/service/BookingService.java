package com.parking.system.service;

import com.parking.system.dto.BookingRequest;
import com.parking.system.dto.BookingResponse;
import com.parking.system.model.Booking;
import com.parking.system.model.BookingStatus;
import com.parking.system.model.ParkingSlot;
import com.parking.system.model.SlotStatus;
import com.parking.system.model.User;
import com.parking.system.model.VehicleType;
import com.parking.system.repository.BookingRepository;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ParkingSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, ParkingSlotRepository slotRepository,
            UserRepository userRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.bookingMapper = bookingMapper;
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookingRepository.findByUserOrderByEntryTimeDesc(user).stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByEntryTimeDesc().stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse bookSlot(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        ParkingSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        if (slot.getStatus() == SlotStatus.OCCUPIED || bookingRepository.existsBySlotAndStatus(slot, BookingStatus.ACTIVE)) {
            throw new IllegalStateException("Slot is already occupied");
        }

        slot.setStatus(SlotStatus.OCCUPIED);
        slotRepository.save(slot);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSlot(slot);
        booking.setVehicleNumber(request.getVehicleNumber().trim().toUpperCase());
        booking.setEntryTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.ACTIVE);
        booking.setAmount(0.0);

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse exitSlot(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Booking is already completed");
        }

        booking.setExitTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setAmount(calculateAmount(booking));

        ParkingSlot slot = booking.getSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        slotRepository.save(slot);

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }


    private double calculateAmount(Booking booking) {
        long minutes = Math.max(1, Duration.between(booking.getEntryTime(), booking.getExitTime()).toMinutes());
        long billableHours = (long) Math.ceil(minutes / 60.0);
        double ratePerHour = booking.getSlot().getType() == VehicleType.CAR ? 20.0 : 10.0;
        return billableHours * ratePerHour;
    }
}
