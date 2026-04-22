package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class InvestorBondsResponse {
    private UUID investorId;
    private String fullName;
    private String email;
    private String nationalId;
    private String payoutAccount;
    private List<InvestmentResponse> bonds;
}
