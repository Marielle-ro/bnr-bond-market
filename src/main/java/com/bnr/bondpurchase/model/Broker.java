package com.bnr.bondpurchase.model;

import com.bnr.bondpurchase.enums.BrokerStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "brokers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Broker {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    // This is the sequential number we show the frontend UI (1, 2, 3)
    @Column(columnDefinition = "serial", insertable = false, updatable = false)
    private Long displayId;

    // Authentication fields directly on the Broker
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // Company Information
    @Column(nullable = false)
    private String companyName;

    // The account where investors send money to buy the bond
    private String collectionAccount;

    @Enumerated(EnumType.STRING)
    private BrokerStatus status = BrokerStatus.PENDING;
}