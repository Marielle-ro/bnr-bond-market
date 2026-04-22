package com.bnr.payout.service;

import com.bnr.payout.dto.BondPurchaseRequest;
import com.bnr.payout.dto.PaymentResult;
import com.bnr.payout.dto.RwandaBankEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class BankPayoutService {

    public PaymentResult sendPayout(BondPurchaseRequest request) {

        if (request.getBankName() == null) {
            return new PaymentResult("FAILED", null,
                    "Bank payout failed: No bank specified for investor account");
        }

        RwandaBankEnum bank = request.getBankName();

        if (request.getInvestorAccount() == null || request.getInvestorAccount().isBlank()) {
            return new PaymentResult("FAILED", null,
                    "Bank payout failed: Account number is required for " + bank.getDisplayName());
        }

        if (!bank.isValidAccount(request.getInvestorAccount())) {
            return new PaymentResult("FAILED", null,
                    "Bank payout failed: Invalid account number for " + bank.getDisplayName()
                    + ". Expected format: " + bank.getFormatDescription()
                    + ". You entered " + request.getInvestorAccount().length() + " digits");
        }

        log.info("🏦 [Bank Payout] Sending {} {} to account: {} | Bank: {}",
                request.getAmount(), request.getCurrency(),
                request.getInvestorAccount(), bank.getDisplayName());

        simulateDelay(2000);

        boolean success = Math.random() > 0.03;

        if (success) {
            String txnId = "BPAYOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [Bank Payout] SUCCESS | TxnID: {} | Account: {}", txnId, request.getInvestorAccount());
            return new PaymentResult(
                    "SUCCESS", txnId,
                    "Coupon of " + request.getAmount() + " " + request.getCurrency()
                            + " credited to " + bank.getDisplayName()
                            + " account " + request.getInvestorAccount()
            );
        } else {
            log.warn("❌ [Bank Payout] FAILED for account: {}", request.getInvestorAccount());
            return new PaymentResult("FAILED", null,
                    "Bank payout failed: Account frozen or transfer limit exceeded at " + bank.getDisplayName());
        }
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
