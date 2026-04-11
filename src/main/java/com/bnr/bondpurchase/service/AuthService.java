package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.*;
import com.bnr.bondpurchase.enums.BrokerStatus;
import com.bnr.bondpurchase.enums.UserRole;
import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.model.User;
import com.bnr.bondpurchase.repository.BrokerRepository;
import com.bnr.bondpurchase.repository.UserRepository;
import com.bnr.bondpurchase.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BrokerRepository brokerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // --- ADMIN ---
    public AuthResponse loginAdmin(LoginRequest request) {
        User admin = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Unauthorized access");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(admin.getEmail(), "ADMIN");
        return new AuthResponse(token, "ADMIN");
    }

    // --- INVESTOR ---
    public AuthResponse registerInvestor(InvestorRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setNationalId(request.getNationalId());
        user.setPayoutAccount(request.getPayoutAccount());
        user.setRole(UserRole.INVESTOR);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), "INVESTOR");
        return new AuthResponse(token, "INVESTOR");
    }

    public AuthResponse loginInvestor(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Investor not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtService.generateToken(user.getEmail(), "INVESTOR");
        return new AuthResponse(token, "INVESTOR");
    }

    public InvestorProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Investor not found"));
        return mapToProfileResponse(user);
    }

    public InvestorProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Investor not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        user.setPayoutAccount(request.getPayoutAccount());
        user.setPayoutMethod(request.getPayoutMethod());
        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    // --- BROKER ---
    public AuthResponse registerBroker(BrokerRegisterRequest request) {
        if (brokerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Broker email already registered!");
        }

        Broker broker = new Broker();
        broker.setEmail(request.getEmail());
        broker.setPassword(passwordEncoder.encode(request.getPassword()));
        broker.setCompanyName(request.getCompanyName());
        broker.setCollectionAccount(request.getCollectionAccount());
        broker.setRdbCertificateUrl(request.getRdbCertificateUrl());
        broker.setStatus(BrokerStatus.PENDING);
        brokerRepository.save(broker);

        return new AuthResponse(null, "REGISTRATION_SUCCESS_PENDING_APPROVAL");
    }

    public AuthResponse loginBroker(LoginRequest request) {
        Broker broker = brokerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Broker not found!"));

        if (broker.getStatus() == BrokerStatus.PENDING) {
            throw new RuntimeException("Your account is pending admin approval");
        }
        if (broker.getStatus() == BrokerStatus.REJECTED) {
            throw new RuntimeException("Your account has been rejected and cannot access the platform");
        }
        if (broker.getStatus() == BrokerStatus.SUSPENDED) {
            throw new RuntimeException("Your account has been suspended. Contact BNR support");
        }

        if (!passwordEncoder.matches(request.getPassword(), broker.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtService.generateToken(broker.getEmail(), "BROKER");
        return new AuthResponse(token, "BROKER");
    }

    // --- UTILITY ---
    public List<BrokerResponse> getApprovedBrokers() {
        return brokerRepository.findByStatus(BrokerStatus.APPROVED)
                .stream()
                .map(broker -> BrokerResponse.builder()
                        .id(broker.getId())
                        .companyName(broker.getCompanyName())
                        .collectionAccount(broker.getCollectionAccount())
                        .build())
                .toList();
    }

    private InvestorProfileResponse mapToProfileResponse(User user) {
        return InvestorProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .nationalId(user.getNationalId())
                .payoutAccount(user.getPayoutAccount())
                .payoutMethod(user.getPayoutMethod())
                .build();
    }
}
