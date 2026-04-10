package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.*;
import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- DASHBOARD ---
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // --- BROKER MANAGEMENT ---
    @GetMapping("/brokers")
    public ResponseEntity<List<Broker>> getAllBrokers() {
        return ResponseEntity.ok(adminService.getAllBrokers());
    }

    @PutMapping("/brokers/{brokerId}/approve")
    public ResponseEntity<Broker> approveBroker(@PathVariable UUID brokerId, Authentication auth) {
        return ResponseEntity.ok(adminService.approveBroker(auth.getName(), brokerId));
    }

    @PutMapping("/brokers/{brokerId}/reject")
    public ResponseEntity<Broker> rejectBroker(@PathVariable UUID brokerId, Authentication auth) {
        return ResponseEntity.ok(adminService.rejectBroker(auth.getName(), brokerId));
    }

    @PutMapping("/brokers/{brokerId}/suspend")
    public ResponseEntity<Broker> suspendBroker(@PathVariable UUID brokerId,
                                                @Valid @RequestBody SuspendBrokerRequest request,
                                                Authentication auth) {
        return ResponseEntity.ok(adminService.suspendBroker(auth.getName(), brokerId, request.getReason()));
    }

    @PutMapping("/brokers/{brokerId}/reactivate")
    public ResponseEntity<Broker> reactivateBroker(@PathVariable UUID brokerId, Authentication auth) {
        return ResponseEntity.ok(adminService.reactivateBroker(auth.getName(), brokerId));
    }

    // --- BOND TYPE MANAGEMENT ---
    @GetMapping("/bonds")
    public ResponseEntity<List<BondTypeResponse>> getAllBonds() {
        return ResponseEntity.ok(adminService.getAllBondTypes());
    }

    @PostMapping("/bonds")
    public ResponseEntity<BondTypeResponse> createBond(@Valid @RequestBody BondTypeRequest request,
                                                       Authentication auth) {
        return ResponseEntity.ok(adminService.createBondType(auth.getName(), request));
    }

    @PutMapping("/bonds/{bondTypeId}")
    public ResponseEntity<BondTypeResponse> updateBond(@PathVariable UUID bondTypeId,
                                                       @Valid @RequestBody BondTypeRequest request,
                                                       Authentication auth) {
        return ResponseEntity.ok(adminService.updateBondType(auth.getName(), bondTypeId, request));
    }

    @PutMapping("/bonds/{bondTypeId}/toggle")
    public ResponseEntity<BondTypeResponse> toggleBond(@PathVariable UUID bondTypeId, Authentication auth) {
        return ResponseEntity.ok(adminService.toggleBondStatus(auth.getName(), bondTypeId));
    }

    // --- MONTHLY BROKER RANKING ---
    @GetMapping("/reports/top-brokers")
    public ResponseEntity<List<TopBrokerResponse>> getTopBrokers(@RequestParam int year,
                                                                 @RequestParam int month) {
        return ResponseEntity.ok(adminService.getTopBrokersByMonth(year, month));
    }

    // --- AUDIT LOGS ---
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
