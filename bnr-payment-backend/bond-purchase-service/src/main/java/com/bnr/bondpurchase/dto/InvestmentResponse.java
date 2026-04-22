package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InvestmentResponse {
    private UUID id;
    private String bondName;
    private Integer durationYears;
    private Double couponRate;
    private Double brokerFee;
    private Double brokerFeeAmount;
    private Double amountInvested;
    private Double totalAmountToPay;
    private String bondNumber;
    private LocalDateTime purchaseDate;
    private String status;
    private String brokerCompanyName;
}
