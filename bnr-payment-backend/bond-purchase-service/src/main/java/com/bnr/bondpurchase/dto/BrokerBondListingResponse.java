package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BrokerBondListingResponse {
    private UUID id;
    private UUID brokerBondListingId;
    private String brokerCompanyName;
    private String collectionAccount;
    private String bondName;
    private Integer durationYears;
    private Double couponRate;   // From BondType — fixed by BNR
    private Double brokerFee;    // Set by broker
    private Integer quantityAvailable;
}
