package com.hospital.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private Long userId;
    private Long doctorId;
}
