package com.bnr.bondpurchase.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bond_purchases")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BondPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String purchaseId;

    @Column(nullable = false)
    private String investorId;

    private String investorPhone;
    private String investorAccount;

    @Column(nullable = false)
    private String paymentMethod; // MOMO or BANK

    @Column(nullable = false)
    private BigDecimal amount;

    private String currency;

    @Column(nullable = false)
    private BigDecimal interestRate; // e.g. 0.075

    @Column(nullable = false)
    private int termMonths;

    @Column(nullable = false)
    private String status; // ACTIVE, COMPLETED, CANCELLED

    private LocalDateTime purchaseDate;
    private LocalDateTime maturityDate;
    private LocalDateTime lastPayoutDate;
    private int payoutCount;
}
