package com.bnr.bondpurchase.config;

import com.bnr.bondpurchase.entity.User;
import com.bnr.bondpurchase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            admin.setFullName("BNR Admin");
            userRepository.save(admin);
            log.info("✅ Admin user seeded: {}", adminEmail);
        } else {
            log.info("ℹ️ Admin user already exists, skipping seed.");
        }
    }
}
