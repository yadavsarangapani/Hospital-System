package com.hospital.backend.controller;

import com.hospital.backend.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Reports", description = "System analytics and reports (Admin only)")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/overview")
    @Operation(summary = "Get system overview")
    public ResponseEntity<Map<String, Object>> overview() {
        return ResponseEntity.ok(reportService.systemOverview());
    }

    @GetMapping("/appointments-per-doctor")
    @Operation(summary = "Get appointments count per doctor")
    public ResponseEntity<List<Map<String, Object>>> appointmentsPerDoctor() {
        return ResponseEntity.ok(reportService.appointmentsPerDoctor());
    }

    @GetMapping("/revenue-per-department")
    @Operation(summary = "Get revenue per department")
    public ResponseEntity<List<Map<String, Object>>> revenuePerDepartment() {
        return ResponseEntity.ok(reportService.revenuePerDepartment());
    }

    @GetMapping("/daily")
    @Operation(summary = "Get daily appointment stats")
    public ResponseEntity<List<Map<String, Object>>> dailyStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.dailyStats(startDate, endDate));
    }

    @GetMapping("/monthly")
    @Operation(summary = "Get monthly appointment stats")
    public ResponseEntity<List<Map<String, Object>>> monthlyStats() {
        return ResponseEntity.ok(reportService.monthlyStats());
    }
}
