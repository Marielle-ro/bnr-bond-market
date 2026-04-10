package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.*;
import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // --- ADMIN ---
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    // --- INVESTOR ---
    @PostMapping("/investor/register")
    public ResponseEntity<AuthResponse> registerInvestor(@Valid @RequestBody InvestorRegisterRequest request) {
        return ResponseEntity.ok(authService.registerInvestor(request));
    }

    @PostMapping("/investor/login")
    public ResponseEntity<AuthResponse> loginInvestor(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginInvestor(request));
    }

    // --- BROKER ---
    @PostMapping("/broker/register")
    public ResponseEntity<AuthResponse> registerBroker(@Valid @RequestBody BrokerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerBroker(request));
    }

    @PostMapping("/broker/login")
    public ResponseEntity<AuthResponse> loginBroker(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginBroker(request));
    }

    @GetMapping("/brokers")
    public ResponseEntity<List<BrokerResponse>> getBrokers() {
        return ResponseEntity.ok(authService.getApprovedBrokers());
    }
}