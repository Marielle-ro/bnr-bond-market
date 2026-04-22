package com.bnr.bondpurchase.config;

import com.bnr.bondpurchase.enums.UserRole;
import com.bnr.bondpurchase.model.User;
import com.bnr.bondpurchase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@bnr.rw}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:SuperSecretAdminPassword123!}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        // Only seed if no admin exists
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword)); // Hashed & Salted automatically!
            admin.setFullName("BNR System Admin");
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);
            System.out.println("✅ Default BNR Admin seeded successfully!");
        }
    }
}