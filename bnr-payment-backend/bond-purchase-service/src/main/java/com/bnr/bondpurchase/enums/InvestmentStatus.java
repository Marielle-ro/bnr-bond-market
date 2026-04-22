package com.bnr.bondpurchase.enums;

public enum InvestmentStatus {
    PENDING_PAYMENT, // waiting for payment to clear
    ACTIVE,          // payment confirmed, bond running
    INACTIVE         // matured or exited
}
