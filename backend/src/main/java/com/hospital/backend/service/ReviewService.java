package com.hospital.backend.service;

import com.hospital.backend.dto.ReviewDTO;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ReviewDTO createReview(ReviewDTO dto, Long patientId) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Review review = Review.builder()
                .doctor(doctor)
                .patient(patient)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        review = reviewRepository.save(review);

        // Update doctor average rating
        Double avgRating = reviewRepository.averageRatingByDoctorId(dto.getDoctorId());
        doctor.setAverageRating(avgRating);
        doctorRepository.save(doctor);

        return toDTO(review);
    }

    public List<ReviewDTO> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .doctorId(r.getDoctor().getId())
                .patientId(r.getPatient().getId())
                .patientName(r.getPatient().getName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null)
                .build();
    }
}
