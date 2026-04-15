package com.bnr.payout.consumer;

import com.bnr.payout.config.RabbitMQConfig;
import com.bnr.payout.dto.BondPurchaseRequest;
import com.bnr.payout.dto.PaymentResult;
import com.bnr.payout.entity.PayoutRecord;
import com.bnr.payout.repository.PayoutRepository;
import com.bnr.payout.service.BankPayoutService;
import com.bnr.payout.service.MoMoPayoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutConsumer {

    private final MoMoPayoutService moMoPayoutService;
    private final BankPayoutService bankPayoutService;
    private final PayoutRepository payoutRepository;

    @RabbitListener(queues = RabbitMQConfig.PAYOUT_QUEUE)
    public void processPayout(BondPurchaseRequest request) {
        log.info("📥 [PAYOUT CONSUMER] Received payout request | InvestorId: {} | PurchaseId: {} | Amount: {} {}",
                request.getInvestorId(), request.getPurchaseId(),
                request.getAmount(), request.getCurrency());

        PaymentResult result;

        try {
            if ("MOMO".equalsIgnoreCase(request.getPaymentMethod())) {
                result = moMoPayoutService.sendPayout(request);
            } else if ("BANK".equalsIgnoreCase(request.getPaymentMethod())) {
                result = bankPayoutService.sendPayout(request);
            } else {
                log.error("❌ Unknown payout method: {}", request.getPaymentMethod());
                result = new PaymentResult("FAILED", null,
                        "Unknown payout method: " + request.getPaymentMethod());
            }

            PayoutRecord record = new PayoutRecord();
            record.setPurchaseId(request.getPurchaseId());
            record.setInvestorId(request.getInvestorId());
            record.setAmount(request.getAmount());
            record.setCurrency(request.getCurrency());
            record.setMethod(request.getPaymentMethod());
            record.setStatus(result.getStatus());
            record.setTransactionId(result.getTransactionId());
            record.setFailureReason("FAILED".equals(result.getStatus()) ? result.getMessage() : null);
            record.setPayoutDate(LocalDateTime.now());
            payoutRepository.save(record);

            log.info("💾 [PAYOUT CONSUMER] Saved record | Status: {} | TxnID: {}",
                    result.getStatus(), result.getTransactionId());

        } catch (Exception e) {
            log.error("❌ [PAYOUT CONSUMER] Error processing payout for {}: {}",
                    request.getPurchaseId(), e.getMessage(), e);
            throw e;
        }
    }
}
