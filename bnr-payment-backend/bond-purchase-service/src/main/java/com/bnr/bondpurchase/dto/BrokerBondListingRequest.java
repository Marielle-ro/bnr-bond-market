package com.bnr.bondpurchase.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BrokerBondListingRequest {
    @NotNull
    private UUID bondTypeId;
    @NotNull
    private Integer quantityAvailable;
    @NotNull
    private Double brokerFee;
}
