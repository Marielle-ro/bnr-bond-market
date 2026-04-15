package com.bnr.payout.service;

import com.bnr.payout.dto.BondPurchaseRequest;
import com.bnr.payout.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Simulates sending a payout (coupon/interest) to an investor via MTN MoMo.
 * In production, replace with real MTN MoMo Disbursements API.
 */
@Service
@Slf4j
public class MoMoPayoutService {

    public PaymentResult sendPayout(BondPurchaseRequest request) {
        log.info("📱 [MoMo Payout] Sending {} {} to phone: {}",
                request.getAmount(), request.getCurrency(), request.getInvestorPhone());

        simulateDelay(1200);

        if (request.getInvestorPhone() == null || !request.getInvestorPhone().matches("07[0-9]{8}")) {
            log.warn("❌ [MoMo Payout] Invalid phone: {}", request.getInvestorPhone());
            return new PaymentResult("FAILED", null, "MoMo Payout: Invalid phone number");
        }

        boolean success = Math.random() > 0.05; // 95% success

        if (success) {
            String txnId = "MPAYOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [MoMo Payout] SUCCESS | TxnID: {} | Phone: {} | Amount: {} {}",
                    txnId, request.getInvestorPhone(), request.getAmount(), request.getCurrency());
            return new PaymentResult(
                    "SUCCESS",
                    txnId,
                    "Coupon of " + request.getAmount() + " " + request.getCurrency()
                            + " sent to MoMo " + request.getInvestorPhone()
            );
        } else {
            log.warn("❌ [MoMo Payout] FAILED for phone: {}", request.getInvestorPhone());
            return new PaymentResult("FAILED", null, "MoMo Payout: Network timeout or recipient unavailable");
        }
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
