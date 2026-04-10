package com.bnr.bondpurchase.enums;

public enum BrokerStatus {
    PENDING,     // just registered — waiting for admin approval
    APPROVED,    // visible to investors
    REJECTED,    // admin rejected
    SUSPENDED    // was approved, now suspended
}
