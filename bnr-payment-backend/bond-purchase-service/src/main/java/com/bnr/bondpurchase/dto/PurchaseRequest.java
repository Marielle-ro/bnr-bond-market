package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PurchaseRequest {
    @NotNull
    private UUID brokerBondListingId;
    @NotNull
    private Double amount;
    @NotNull
    private String currency;           // e.g. "RWF"
    @NotNull
    private String paymentMethod;      // "MOMO" or "BANK"
    private String momoProvider;       // "MTN" or "AIRTEL" — required if paymentMethod=MOMO
    private String bankName;           // e.g. "BK" — required if paymentMethod=BANK
    private String investorPhone;      // required if paymentMethod=MOMO
    private String investorAccount;    // required if paymentMethod=BANK
}
