package com.bnr.payment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_records")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRecord {

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
    private String method;         // MOMO or BANK

    @Column(nullable = false)
    private String status;         // SUCCESS or FAILED

    private String transactionId;
    private String failureReason;
    private LocalDateTime timestamp;
}
