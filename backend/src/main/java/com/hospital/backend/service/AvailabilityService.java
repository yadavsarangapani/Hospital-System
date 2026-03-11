package com.hospital.backend.service;

import com.hospital.backend.dto.AvailabilityDTO;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<AvailabilityDTO> getByDoctorId(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AvailabilityDTO createSlot(Long doctorId, AvailabilityDTO dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DoctorAvailability slot = DoctorAvailability.builder()
                .doctor(doctor)
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .slotDurationMinutes(dto.getSlotDurationMinutes() != null ? dto.getSlotDurationMinutes() : 30)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return toDTO(availabilityRepository.save(slot));
    }

    public AvailabilityDTO updateSlot(Long slotId, AvailabilityDTO dto) {
        DoctorAvailability slot = availabilityRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Availability slot not found"));

        slot.setDayOfWeek(dto.getDayOfWeek());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        slot.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        slot.setIsActive(dto.getIsActive());

        return toDTO(availabilityRepository.save(slot));
    }

    public void deleteSlot(Long slotId) {
        availabilityRepository.deleteById(slotId);
    }

    /**
     * Generate bookable time slots for a doctor on a specific date
     */
    public List<Map<String, Object>> getAvailableSlots(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<DoctorAvailability> availability = availabilityRepository
                .findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        List<Map<String, Object>> slots = new ArrayList<>();

        for (DoctorAvailability avail : availability) {
            if (avail.getIsActive() == null || !avail.getIsActive()) continue;

            int duration = avail.getSlotDurationMinutes() != null ? avail.getSlotDurationMinutes() : 30;
            LocalTime current = avail.getStartTime();

            while (current.plusMinutes(duration).compareTo(avail.getEndTime()) <= 0) {
                LocalTime slotEnd = current.plusMinutes(duration);

                // Check if slot is already booked
                boolean booked = appointmentRepository.existsDoctorOverlap(
                        doctorId, date, current, slotEnd);

                Map<String, Object> slot = new HashMap<>();
                slot.put("startTime", current.toString());
                slot.put("endTime", slotEnd.toString());
                slot.put("available", !booked);

                slots.add(slot);
                current = slotEnd;
            }
        }

        return slots;
    }

    private AvailabilityDTO toDTO(DoctorAvailability avail) {
        return AvailabilityDTO.builder()
                .id(avail.getId())
                .doctorId(avail.getDoctor().getId())
                .dayOfWeek(avail.getDayOfWeek())
                .startTime(avail.getStartTime())
                .endTime(avail.getEndTime())
                .slotDurationMinutes(avail.getSlotDurationMinutes())
                .isActive(avail.getIsActive())
                .build();
    }
}
