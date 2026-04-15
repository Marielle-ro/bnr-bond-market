package com.bnr.payment.service;

import com.bnr.payment.dto.BondPurchaseRequest;
import com.bnr.payment.dto.PaymentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Simulates bank transfer payment collection (e.g. BK, Equity, I&M Rwanda).
 * In production, replace with real bank API / RTGS integration.
 */
@Service
@Slf4j
public class BankPaymentService {

    public PaymentResult processPayment(BondPurchaseRequest request) {
        if (request.getBankName() == null) {
            return new PaymentResult("FAILED", null, "Bank: Please select a bank");
        }

        log.info("🏦 [Bank] Initiating debit from account {} | Bank: {} | Amount: {} {}",
                request.getInvestorAccount(), request.getBankName().getDisplayName(),
                request.getAmount(), request.getCurrency());

        // Simulate bank processing delay (2 seconds)
        simulateDelay(2000);

        // Validate account number (basic format check)
        if (request.getInvestorAccount() == null || request.getInvestorAccount().length() < 6) {
            log.warn("❌ [Bank] Invalid account number: {}", request.getInvestorAccount());
            return new PaymentResult("FAILED", null,
                    "Bank: Invalid account number");
        }

        // Simulate 95% success rate (banks more reliable than mobile)
        boolean success = Math.random() > 0.05;

        if (success) {
            String txnId = "BANK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [Bank] Transfer SUCCESS | TxnID: {} | Account: {}",
                    txnId, request.getInvestorAccount());
            return new PaymentResult(
                    "SUCCESS",
                    txnId,
                    request.getBankName().getDisplayName() + " transfer of " + request.getAmount()
                            + " " + request.getCurrency() + " debited from account " + request.getInvestorAccount()
            );
        } else {
            log.warn("❌ [Bank] Transfer FAILED for account: {}", request.getInvestorAccount());
            return new PaymentResult(
                    "FAILED",
                    null,
                    "Bank: Account not found, insufficient funds, or daily limit exceeded"
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
