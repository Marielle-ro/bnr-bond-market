package com.bnr.bondpurchase.enums;

public enum BondDuration {
    THREE_YEAR("3y", 36),
    FIVE_YEAR("5y", 60),
    SEVEN_YEAR("7y", 84),
    TEN_YEAR("10y", 120),
    FIFTEEN_YEAR("15y", 180),
    TWENTY_YEAR("20y", 240);

    private final String code;        // used in bond number e.g. "7y"
    private final int maturityMonths; // total months to maturity

    BondDuration(String code, int maturityMonths) {
        this.code = code;
        this.maturityMonths = maturityMonths;
    }

    public String getCode() { return code; }
    public int getMaturityMonths() { return maturityMonths; }

    // Match from maturity months — used when generating bond number
    public static BondDuration fromMaturityMonths(int months) {
        for (BondDuration d : values()) {
            if (d.maturityMonths == months) return d;
        }
        throw new IllegalArgumentException("Unknown maturity: " + months);
    }
}