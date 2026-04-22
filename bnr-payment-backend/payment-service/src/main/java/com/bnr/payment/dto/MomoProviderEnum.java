package com.bnr.payment.dto;

public enum MomoProviderEnum {
    MTN("MTN Mobile Money"),
    AIRTEL("Airtel Money");

    private final String displayName;

    MomoProviderEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
