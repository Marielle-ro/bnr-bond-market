package com.bnr.payment.service;

import com.bnr.payment.dto.BondPurchaseRequest;
import com.bnr.payment.dto.PaymentResult;
import com.bnr.payment.dto.RwandaBankEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class BankPaymentService {

    public PaymentResult processPayment(BondPurchaseRequest request) {

        if (request.getBankName() == null) {
            return new PaymentResult("FAILED", null,
                    "Bank payment failed: Please select a bank. Supported banks: " + getSupportedBanks());
        }

        RwandaBankEnum bank = request.getBankName();

        if (request.getInvestorAccount() == null || request.getInvestorAccount().isBlank()) {
            return new PaymentResult("FAILED", null,
                    "Bank payment failed: Account number is required for " + bank.getDisplayName());
        }

        if (!bank.isValidAccount(request.getInvestorAccount())) {
            return new PaymentResult("FAILED", null,
                    "Bank payment failed: Invalid account number for " + bank.getDisplayName()
                    + ". Expected format: " + bank.getFormatDescription()
                    + ". You entered " + request.getInvestorAccount().length() + " digits");
        }

        log.info("🏦 [Bank] Initiating debit | Bank: {} | Account: {} | Amount: {} {}",
                bank.getDisplayName(), request.getInvestorAccount(),
                request.getAmount(), request.getCurrency());

        simulateDelay(2000);

        boolean success = Math.random() > 0.05;

        if (success) {
            String txnId = "BANK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("✅ [Bank] SUCCESS | TxnID: {} | Account: {}", txnId, request.getInvestorAccount());
            return new PaymentResult(
                    "SUCCESS", txnId,
                    bank.getDisplayName() + " transfer of " + request.getAmount()
                            + " " + request.getCurrency() + " debited from account " + request.getInvestorAccount()
            );
        } else {
            log.warn("❌ [Bank] FAILED for account: {}", request.getInvestorAccount());
            return new PaymentResult("FAILED", null,
                    "Bank payment failed: Account not found, insufficient funds, or daily limit exceeded at "
                    + bank.getDisplayName());
        }
    }

    private String getSupportedBanks() {
        StringBuilder sb = new StringBuilder();
        for (RwandaBankEnum bank : RwandaBankEnum.values()) {
            sb.append(bank.name()).append(" (").append(bank.getDisplayName()).append("), ");
        }
        return sb.toString().replaceAll(", $", "");
    }

    private void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
