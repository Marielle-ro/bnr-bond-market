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
}
