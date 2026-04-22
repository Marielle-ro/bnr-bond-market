package com.bnr.bondpurchase.dto;

import lombok.Data;

@Data
public class UpdatePaymentDetailsRequest {
    private String paymentMethod;   // MOMO or BANK
    private String momoProvider;    // MTN or AIRTEL
    private String bankName;        // BK, EQUITY, ...
    private String investorPhone;   // required for MOMO
    private String investorAccount; // required for BANK
    private String currency;        // defaults to RWF when absent
}
