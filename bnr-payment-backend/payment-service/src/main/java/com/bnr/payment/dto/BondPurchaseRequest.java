package com.bnr.payment.dto;

import com.bnr.payment.dto.RwandaBankEnum;
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
    private MomoProviderEnum momoProvider;
    private RwandaBankEnum bankName;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime purchaseDate;
    private int termMonths;
    private BigDecimal interestRate;
}