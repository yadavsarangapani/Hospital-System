package com.hospital.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String qualification;
    private Integer experienceYears;
    private Double consultationFee;
    private Double averageRating;
}
