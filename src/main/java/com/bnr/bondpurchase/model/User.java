package com.bnr.bondpurchase.model;

import com.bnr.bondpurchase.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String nationalId;
    private String payoutAccount;
    private String payoutMethod; // "MOBILE_MONEY" or "BANK"
}
