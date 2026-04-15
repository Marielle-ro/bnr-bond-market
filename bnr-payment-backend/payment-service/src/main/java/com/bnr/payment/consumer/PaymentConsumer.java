package com.bnr.payment.consumer;

import com.bnr.payment.config.RabbitMQConfig;
import com.bnr.payment.dto.BondPurchaseRequest;
import com.bnr.payment.dto.PaymentResult;
import com.bnr.payment.entity.PaymentRecord;
import com.bnr.payment.repository.PaymentRepository;
import com.bnr.payment.service.BankPaymentService;
import com.bnr.payment.service.MoMoPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentConsumer {

    private final MoMoPaymentService moMoPaymentService;
    private final BankPaymentService bankPaymentService;
    private final PaymentRepository paymentRepository;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_QUEUE)
    public void processPayment(BondPurchaseRequest request) {
        log.info("📥 [PAYMENT CONSUMER] Received payment request | PurchaseId: {} | Method: {} | Amount: {} {}",
                request.getPurchaseId(), request.getPaymentMethod(),
                request.getAmount(), request.getCurrency());

        PaymentResult result;

        try {
            if ("MOMO".equalsIgnoreCase(request.getPaymentMethod())) {
                result = moMoPaymentService.processPayment(request);
            } else if ("BANK".equalsIgnoreCase(request.getPaymentMethod())) {
                result = bankPaymentService.processPayment(request);
            } else {
                log.error("❌ Unknown payment method: {}", request.getPaymentMethod());
                result = new PaymentResult("FAILED", null,
                        "Unknown payment method: " + request.getPaymentMethod());
            }

            // Persist the result
            PaymentRecord record = new PaymentRecord();
            record.setPurchaseId(request.getPurchaseId());
            record.setInvestorId(request.getInvestorId());
            record.setAmount(request.getAmount());
            record.setCurrency(request.getCurrency());
            record.setMethod(request.getPaymentMethod());
            record.setStatus(result.getStatus());
            record.setTransactionId(result.getTransactionId());
            record.setFailureReason("FAILED".equals(result.getStatus()) ? result.getMessage() : null);
            record.setTimestamp(LocalDateTime.now());
            paymentRepository.save(record);

            log.info("💾 [PAYMENT CONSUMER] Saved record | Status: {} | TxnID: {}",
                    result.getStatus(), result.getTransactionId());

        } catch (Exception e) {
            log.error("❌ [PAYMENT CONSUMER] Error processing payment for {}: {}",
                    request.getPurchaseId(), e.getMessage(), e);
            throw e; // Re-throw so RabbitMQ sends to DLQ
        }
    }
}
