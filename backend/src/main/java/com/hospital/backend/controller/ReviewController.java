package com.hospital.backend.controller;

import com.hospital.backend.dto.ReviewDTO;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Doctor reviews and ratings")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Submit a review (Patient only)")
    public ResponseEntity<ReviewDTO> create(
            @Valid @RequestBody ReviewDTO dto,
            Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(reviewService.createReview(dto, user.getId()));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get reviews for a doctor")
    public ResponseEntity<List<ReviewDTO>> getDoctorReviews(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.getDoctorReviews(doctorId));
    }
}
