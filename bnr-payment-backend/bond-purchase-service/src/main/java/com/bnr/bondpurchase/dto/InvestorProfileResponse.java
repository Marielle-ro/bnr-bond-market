package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class InvestorProfileResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String nationalId;
    private String payoutAccount;
    private String payoutMethod;
    private String payoutBankName;
}
