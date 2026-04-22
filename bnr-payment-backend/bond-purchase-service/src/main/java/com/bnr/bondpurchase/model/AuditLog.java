package com.bnr.bondpurchase.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String adminEmail;
    private String action;      // e.g. "DEACTIVATED_BOND", "APPROVED_BROKER"
    private String targetType;  // e.g. "BondType", "Broker"
    private String targetId;    // UUID of the affected entity as string
    private String details;     // Human-readable description

    private LocalDateTime performedAt = LocalDateTime.now();
}
