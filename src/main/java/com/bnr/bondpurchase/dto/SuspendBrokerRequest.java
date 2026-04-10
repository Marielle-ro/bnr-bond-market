package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SuspendBrokerRequest {
    @NotBlank(message = "Suspension reason is required")
    private String reason;
}