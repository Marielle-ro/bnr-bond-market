package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.AuthDtos;
import com.bnr.bondpurchase.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.LoginResponse> register(@RequestBody AuthDtos.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
