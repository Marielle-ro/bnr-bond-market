package com.bnr.bondpurchase.model;

import com.bnr.bondpurchase.enums.BondStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bond_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BondType {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. "7-Year Treasury Bond"

    @Column(nullable = false)
    private Integer durationYears;

    @Column(nullable = false)
    private Double couponRate; // Fixed by BNR, brokers cannot change this

    @Enumerated(EnumType.STRING)
    private BondStatus status = BondStatus.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
