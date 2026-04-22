package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BondTypeResponse {
    private UUID id;
    private String name;
    private Integer durationYears;
    private Double couponRate;
    private String status;
}
