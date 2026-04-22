package com.bnr.payout.dto;

public enum RwandaBankEnum {

    BK("Bank of Kigali",              "^[0-9]{10}$",   "10-digit number (e.g. 0001234567)"),
    EQUITY("Equity Bank Rwanda",      "^[0-9]{13}$",   "13-digit number (e.g. 0001234567890)"),
    IM("I&M Bank Rwanda",             "^[0-9]{13}$",   "13-digit number"),
    ECOBANK("Ecobank Rwanda",         "^[0-9]{13}$",   "13-digit number"),
    GTBANK("GT Bank Rwanda",          "^[0-9]{10}$",   "10-digit number"),
    BPR("BPR Bank Rwanda",            "^[0-9]{16}$",   "16-digit number"),
    ACCESS("Access Bank Rwanda",      "^[0-9]{10}$",   "10-digit number"),
    URWEGO("Urwego Bank",             "^[0-9]{10}$",   "10-digit number"),
    BRD("Development Bank of Rwanda", "^[0-9]{11}$",   "11-digit number"),
    UNGUKA("Unguka Bank",             "^[0-9]{10}$",   "10-digit number"),
    ZIGAMA("Zigama CSS",              "^[0-9]{10}$",   "10-digit number"),
    NCBA("NCBA Bank Rwanda",          "^[0-9]{13}$",   "13-digit number"),
    AB("AB Bank Rwanda",              "^[0-9]{10}$",   "10-digit number"),
    SBM("SBM Bank Rwanda",            "^[0-9]{13}$",   "13-digit number"),
    VISTA("Vista Bank Rwanda",        "^[0-9]{10}$",   "10-digit number");

    private final String displayName;
    private final String accountPattern;
    private final String formatDescription;

    RwandaBankEnum(String displayName, String accountPattern, String formatDescription) {
        this.displayName = displayName;
        this.accountPattern = accountPattern;
        this.formatDescription = formatDescription;
    }

    public String getDisplayName() { return displayName; }
    public String getAccountPattern() { return accountPattern; }
    public String getFormatDescription() { return formatDescription; }

    public boolean isValidAccount(String accountNumber) {
        if (accountNumber == null) return false;
        return accountNumber.matches(accountPattern);
    }
}
