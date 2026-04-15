package com.bnr.payout.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BondPurchaseRequest {
    private String purchaseId;
    private String investorId;
    private String investorPhone;
    private String investorAccount;
    private String paymentMethod;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime purchaseDate;
    private int termMonths;
    private BigDecimal interestRate;
}
