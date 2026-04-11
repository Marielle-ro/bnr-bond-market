package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    @NotBlank(message = "Payout account is required")
    private String payoutAccount;
    private String payoutMethod; // e.g. "MOBILE_MONEY" or "BANK"
}
