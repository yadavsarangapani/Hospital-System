package com.hospital.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private Long patientId;
    private String doctorName;
    private String patientName;
    private String specialization;
    private String departmentName;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private String status;
    private String notes;
    private Double consultationFee;
    private String createdAt;
}
