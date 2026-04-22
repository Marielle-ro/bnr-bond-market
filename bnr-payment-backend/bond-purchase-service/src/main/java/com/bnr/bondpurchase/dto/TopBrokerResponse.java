package com.bnr.bondpurchase.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopBrokerResponse {
    private String brokerCompanyName;
    private long totalBondsSold;
    private double totalAmountSold;
}
