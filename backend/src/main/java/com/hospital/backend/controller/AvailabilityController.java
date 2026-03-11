package com.hospital.backend.controller;

import com.hospital.backend.dto.AvailabilityDTO;
import com.hospital.backend.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/availability")
@Tag(name = "Availability", description = "Doctor availability slot management")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get all availability slots for a doctor")
    public ResponseEntity<List<AvailabilityDTO>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getByDoctorId(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/slots")
    @Operation(summary = "Get available time slots for a doctor on a specific date")
    public ResponseEntity<List<Map<String, Object>>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailableSlots(doctorId, date));
    }

    @PostMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Create availability slot (Doctor only)")
    public ResponseEntity<AvailabilityDTO> create(
            @PathVariable Long doctorId,
            @Valid @RequestBody AvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.createSlot(doctorId, dto));
    }

    @PutMapping("/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Update availability slot (Doctor only)")
    public ResponseEntity<AvailabilityDTO> update(
            @PathVariable Long slotId,
            @Valid @RequestBody AvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.updateSlot(slotId, dto));
    }

    @DeleteMapping("/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Delete availability slot (Doctor only)")
    public ResponseEntity<Void> delete(@PathVariable Long slotId) {
        availabilityService.deleteSlot(slotId);
        return ResponseEntity.noContent().build();
    }
}
