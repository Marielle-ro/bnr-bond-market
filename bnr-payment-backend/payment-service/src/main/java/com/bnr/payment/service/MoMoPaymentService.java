package com.bnr.payment.service;

import com.bnr.payment.dto.BondPurchaseRequest;
import com.bnr.payment.dto.MomoProviderEnum;
import com.bnr.payment.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class MoMoPaymentService {

    public PaymentResult processPayment(BondPurchaseRequest request) {

        if (request.getMomoProvider() == null) {
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: Please select a provider (MTN or AIRTEL)");
        }

        MomoProviderEnum provider = request.getMomoProvider();

        if (request.getInvestorPhone() == null || request.getInvestorPhone().isBlank()) {
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: Phone number is required for " + provider.getDisplayName());
        }

        if (!request.getInvestorPhone().matches("07[0-9]{8}")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: Invalid phone number format. Expected 07XXXXXXXX (10 digits). You entered: "
                    + request.getInvestorPhone());
        }

        String phone = request.getInvestorPhone();

        // MTN Rwanda: 078, 079
        if (provider == MomoProviderEnum.MTN && !phone.startsWith("078") && !phone.startsWith("079")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: " + phone + " is not an MTN number. MTN Mobile Money numbers start with 078 or 079");
        }

        // Airtel Rwanda: 072, 073
        if (provider == MomoProviderEnum.AIRTEL && !phone.startsWith("072") && !phone.startsWith("073")) {
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: " + phone + " is not an Airtel number. Airtel Money numbers start with 072 or 073");
        }

        log.info("📱 [MoMo] Initiating {} payment from {} | Amount: {} {}",
                provider.getDisplayName(), phone, request.getAmount(), request.getCurrency());

        simulateDelay(1500);

        boolean success = Math.random() > 0.10;

        if (success) {
            String txnId = "MOMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [MoMo] SUCCESS | TxnID: {} | Phone: {}", txnId, phone);
            return new PaymentResult(
                    "SUCCESS", txnId,
                    provider.getDisplayName() + " payment of " + request.getAmount()
                            + " " + request.getCurrency() + " collected from " + phone
            );
        } else {
            log.warn("❌ [MoMo] FAILED for phone: {}", phone);
            return new PaymentResult("FAILED", null,
                    "MoMo payment failed: Insufficient funds or transaction timeout on " + provider.getDisplayName());
        }
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
