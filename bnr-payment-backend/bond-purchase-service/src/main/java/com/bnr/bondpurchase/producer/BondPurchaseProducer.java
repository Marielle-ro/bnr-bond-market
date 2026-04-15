package com.bnr.bondpurchase.producer;

import com.bnr.bondpurchase.config.RabbitMQConfig;
import com.bnr.bondpurchase.dto.BondPurchaseRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BondPurchaseProducer {

    private final AmqpTemplate amqpTemplate;

    /**
     * Send a payment collection request to payment-service.
     * Called immediately when an investor purchases a bond.
     */
    public void sendPaymentRequest(BondPurchaseRequest request) {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_EXCHANGE,
                RabbitMQConfig.PAYMENT_KEY,
                request
        );
        log.info("📤 [PAYMENT QUEUE] Sent payment request for purchase: {}", request.getPurchaseId());
    }

    /**
     * Send a payout disbursement request to payout-service.
     * Called every 6 months by the PayoutScheduler.
     */
    public void sendPayoutRequest(BondPurchaseRequest request) {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PAYOUT_EXCHANGE,
                RabbitMQConfig.PAYOUT_KEY,
                request
        );
        log.info("📤 [PAYOUT QUEUE] Sent payout request for investor: {} | amount: {} {}",
                request.getInvestorId(), request.getAmount(), request.getCurrency());
    }
}
