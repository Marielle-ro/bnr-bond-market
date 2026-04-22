package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalInvestors;
    private long totalBrokers;
    private long totalBondsPurchased;
    private double totalAmountInvested;
}
