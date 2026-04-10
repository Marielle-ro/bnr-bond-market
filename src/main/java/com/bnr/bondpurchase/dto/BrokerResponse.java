package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BrokerResponse {
    private UUID id;
    private Long displayId; // Used by the frontend strictly for UI display
    private String companyName;
    private String collectionAccount;
}