package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.AuthDtos;
import com.bnr.bondpurchase.entity.User;
import com.bnr.bondpurchase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        log.info("✅ User logged in: {}", request.getEmail());
        return new AuthDtos.LoginResponse(token, user.getEmail(), user.getRole());
    }

    public AuthDtos.LoginResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "INVESTOR");
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        log.info("✅ New user registered: {}", user.getEmail());
        return new AuthDtos.LoginResponse(token, user.getEmail(), user.getRole());
    }
}
