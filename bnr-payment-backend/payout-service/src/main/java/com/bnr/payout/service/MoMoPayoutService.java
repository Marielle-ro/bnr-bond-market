package com.bnr.payout.service;

import com.bnr.payout.dto.BondPurchaseRequest;
import com.bnr.payout.dto.MomoProviderEnum;
import com.bnr.payout.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class MoMoPayoutService {

    public PaymentResult sendPayout(BondPurchaseRequest request) {

        if (request.getMomoProvider() == null) {
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: No provider specified (MTN or AIRTEL)");
        }

        MomoProviderEnum provider = request.getMomoProvider();

        if (request.getInvestorPhone() == null || request.getInvestorPhone().isBlank()) {
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: Phone number is required for " + provider.getDisplayName());
        }

        if (!request.getInvestorPhone().matches("07[0-9]{8}")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: Invalid phone number format. Expected 07XXXXXXXX (10 digits). You entered: "
                    + request.getInvestorPhone());
        }

        String phone = request.getInvestorPhone();

        // MTN Rwanda: 078, 079
        if (provider == MomoProviderEnum.MTN && !phone.startsWith("078") && !phone.startsWith("079")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: " + phone + " is not an MTN number. MTN Mobile Money numbers start with 078 or 079");
        }

        // Airtel Rwanda: 072, 073
        if (provider == MomoProviderEnum.AIRTEL && !phone.startsWith("072") && !phone.startsWith("073")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: " + phone + " is not an Airtel number. Airtel Money numbers start with 072 or 073");
        }

        log.info("📱 [MoMo Payout] Sending {} {} to phone: {} | Provider: {}",
                request.getAmount(), request.getCurrency(), phone, provider.getDisplayName());

        simulateDelay(1200);

        boolean success = Math.random() > 0.05;

        if (success) {
            String txnId = "MPAYOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [MoMo Payout] SUCCESS | TxnID: {} | Phone: {}", txnId, phone);
            return new PaymentResult(
                    "SUCCESS", txnId,
                    "Coupon of " + request.getAmount() + " " + request.getCurrency()
                            + " sent to " + provider.getDisplayName() + " " + phone
            );
        } else {
            log.warn("❌ [MoMo Payout] FAILED for phone: {}", phone);
            return new PaymentResult("FAILED", null,
                    "MoMo payout failed: Network timeout or recipient unavailable on " + provider.getDisplayName());
        }
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
