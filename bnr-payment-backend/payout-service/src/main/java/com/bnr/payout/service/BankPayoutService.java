package com.bnr.payout.service;

import com.bnr.payout.dto.BondPurchaseRequest;
import com.bnr.payout.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Simulates sending a payout (coupon/interest) to an investor via bank transfer.
 * In production, replace with real RTGS / bank API integration.
 */
@Service
@Slf4j
public class BankPayoutService {

    public PaymentResult sendPayout(BondPurchaseRequest request) {
        log.info("🏦 [Bank Payout] Sending {} {} to account: {}",
                request.getAmount(), request.getCurrency(), request.getInvestorAccount());

        simulateDelay(2000);

        if (request.getInvestorAccount() == null || request.getInvestorAccount().length() < 6) {
            log.warn("❌ [Bank Payout] Invalid account: {}", request.getInvestorAccount());
            return new PaymentResult("FAILED", null, "Bank Payout: Invalid account number");
        }

        boolean success = Math.random() > 0.03; // 97% success

        if (success) {
            String txnId = "BPAYOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [Bank Payout] SUCCESS | TxnID: {} | Account: {} | Amount: {} {}",
                    txnId, request.getInvestorAccount(), request.getAmount(), request.getCurrency());
            return new PaymentResult(
                    "SUCCESS",
                    txnId,
                    "Coupon of " + request.getAmount() + " " + request.getCurrency()
                            + " credited to account " + request.getInvestorAccount()
            );
        } else {
            log.warn("❌ [Bank Payout] FAILED for account: {}", request.getInvestorAccount());
            return new PaymentResult("FAILED", null, "Bank Payout: Account frozen or transfer limit exceeded");
        }
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
