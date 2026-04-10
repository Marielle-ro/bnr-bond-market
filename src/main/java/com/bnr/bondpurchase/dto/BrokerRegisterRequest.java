package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BrokerRegisterRequest {
    @NotBlank(message = "Company Name is required") // Safely enforced just for brokers!
    private String companyName;

    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Collection account is required")
    private String collectionAccount;
}