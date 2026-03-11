package com.hospital.backend.controller;

import com.hospital.backend.dto.AppointmentDTO;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointments", description = "Appointment booking and management")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Book an appointment (Patient only)")
    public ResponseEntity<AppointmentDTO> book(
            @Valid @RequestBody AppointmentDTO dto,
            Authentication auth) {
        Long patientId = getUserId(auth);
        return ResponseEntity.ok(appointmentService.bookAppointment(dto, patientId));
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get patient's appointments")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(Authentication auth) {
        Long patientId = getUserId(auth);
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get doctor's appointments")
    public ResponseEntity<List<AppointmentDTO>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/pending")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get pending appointments for a doctor")
    public ResponseEntity<List<AppointmentDTO>> getDoctorPending(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorPendingAppointments(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/schedule")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get doctor's daily schedule")
    public ResponseEntity<List<AppointmentDTO>> getDailySchedule(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getDoctorDailySchedule(doctorId, date));
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Confirm appointment (Doctor only)")
    public ResponseEntity<AppointmentDTO> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Reject appointment (Doctor only)")
    public ResponseEntity<AppointmentDTO> reject(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.rejectAppointment(id));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Mark appointment as completed (Doctor only)")
    public ResponseEntity<AppointmentDTO> complete(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT')")
    @Operation(summary = "Cancel appointment (Admin or Patient before confirmation)")
    public ResponseEntity<AppointmentDTO> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all appointments (Admin only)")
    public ResponseEntity<List<AppointmentDTO>> getAll() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
