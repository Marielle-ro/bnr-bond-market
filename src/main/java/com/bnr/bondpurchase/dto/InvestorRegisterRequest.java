package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InvestorRegisterRequest {
    @NotBlank(message = "Name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "National ID is required")
    private String nationalId;

    @NotBlank(message = "Payout account is required")
    private String payoutAccount;
}