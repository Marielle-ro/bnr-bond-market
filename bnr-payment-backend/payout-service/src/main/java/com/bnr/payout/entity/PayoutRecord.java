package com.bnr.payout.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payout_records")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayoutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String purchaseId;

    @Column(nullable = false)
    private String investorId;

    @Column(nullable = false)
    private BigDecimal amount;

    private String currency;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private String status;

    private String transactionId;
    private String failureReason;
    private LocalDateTime payoutDate;
}
