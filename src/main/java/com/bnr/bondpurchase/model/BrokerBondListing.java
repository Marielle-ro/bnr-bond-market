package com.bnr.bondpurchase.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "broker_bond_listings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BrokerBondListing {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "broker_id", nullable = false)
    private Broker broker;

    @ManyToOne
    @JoinColumn(name = "bond_type_id", nullable = false)
    private BondType bondType;

    @Column(nullable = false)
    private Integer quantityAvailable; // How many bonds this broker has left

    @Column(nullable = false)
    private Double brokerFee; // Fee the broker charges (not the coupon rate)

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
