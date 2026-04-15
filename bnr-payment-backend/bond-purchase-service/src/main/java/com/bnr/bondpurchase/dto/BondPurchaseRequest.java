package com.bnr.bondpurchase.dto;

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
    private String investorPhone;     // for MoMo
    private String investorAccount;   // for Bank transfer
    private String paymentMethod;     // "MOMO" or "BANK"
    private BigDecimal amount;
    private String currency;          // "RWF"
    private LocalDateTime purchaseDate;
    private int termMonths;           // e.g. 12, 24, 36
    private BigDecimal interestRate;  // e.g. 0.075 for 7.5%
}
