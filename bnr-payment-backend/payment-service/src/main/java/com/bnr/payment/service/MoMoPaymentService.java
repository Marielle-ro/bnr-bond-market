package com.bnr.payment.service;

import com.bnr.payment.dto.BondPurchaseRequest;
import com.bnr.payment.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Simulates MTN Mobile Money (MoMo) payment collection.
 * In production, replace with real MTN MoMo API calls.
 */
@Service
@Slf4j
public class MoMoPaymentService {

    public PaymentResult processPayment(BondPurchaseRequest request) {
        if (request.getMomoProvider() == null) {
            return new PaymentResult("FAILED", null, "MoMo: Please select a provider (MTN or AIRTEL)");
        }

        log.info("📱 [MoMo] Initiating {} payment from {} | Amount: {} {}",
                request.getMomoProvider().getDisplayName(),
                request.getInvestorPhone(), request.getAmount(), request.getCurrency());

        // Simulate network/processing delay (1.5 seconds)
        simulateDelay(1500);

        // Validate phone number format (basic Rwanda check: 07XXXXXXXX)
        if (request.getInvestorPhone() == null || !request.getInvestorPhone().matches("07[0-9]{8}")) {
            log.warn("❌ [MoMo] Invalid phone number: {}", request.getInvestorPhone());
            return new PaymentResult("FAILED", null,
                    "MoMo: Invalid phone number format. Expected 07XXXXXXXX");
        }

        // Simulate 90% success rate
        boolean success = Math.random() > 0.10;

        if (success) {
            String txnId = "MOMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [MoMo] Payment SUCCESS | TxnID: {} | Phone: {}",
                    txnId, request.getInvestorPhone());
            return new PaymentResult(
                    "SUCCESS",
                    txnId,
                    request.getMomoProvider().getDisplayName() + " payment of " + request.getAmount()
                            + " " + request.getCurrency() + " collected from " + request.getInvestorPhone()
            );
        } else {
            log.warn("❌ [MoMo] Payment FAILED for phone: {}", request.getInvestorPhone());
            return new PaymentResult(
                    "FAILED",
                    null,
                    "MoMo: Insu fficient funds or transaction timeout"
            );
        }
    }

    private void simulateDelay(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
