package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RabbitMQPublisher {

    private final RabbitTemplate rabbitTemplate;

    /**
     * Publishes a payment request to the payment-service via payment.exchange.
     * The payment-service will process the payment (MoMo or Bank) and save a PaymentRecord.
     */
    public void publishPaymentRequest(UUID investmentId, String investorId,
                                       String investorPhone, String investorAccount,
                                       String paymentMethod, String momoProvider,
                                       String bankName, Double amount, String currency,
                                       Integer durationYears, Double interestRate) {
        Map<String, Object> message = new HashMap<>();
        message.put("purchaseId", investmentId.toString());
        message.put("investorId", investorId);
        message.put("investorPhone", investorPhone);
        message.put("investorAccount", investorAccount);
        message.put("paymentMethod", paymentMethod);
        message.put("momoProvider", momoProvider);
        message.put("bankName", bankName);
        message.put("amount", BigDecimal.valueOf(amount));
        message.put("currency", currency);
        message.put("purchaseDate", LocalDateTime.now().toString());
        message.put("termMonths", durationYears * 12);
        message.put("interestRate", BigDecimal.valueOf(interestRate));

        rabbitTemplate.convertAndSend(RabbitMQConfig.PAYMENT_EXCHANGE, RabbitMQConfig.PAYMENT_KEY, message);
        log.info("Payment request published for investment: {}", investmentId);
    }

    /**
     * Publishes a payout schedule to the payout-service via payout.exchange.
     * The payout-service will send coupon payments every 6 months.
     */
    public void publishPayoutSchedule(UUID investmentId, String investorId,
                                       String investorPhone, String investorAccount,
                                       String paymentMethod, String momoProvider,
                                       String bankName, Double amount,
                                       Double interestRate, Integer durationYears,
                                       String currency) {
        Map<String, Object> message = new HashMap<>();
        message.put("purchaseId", investmentId.toString());
        message.put("investorId", investorId);
        message.put("investorPhone", investorPhone);
        message.put("investorAccount", investorAccount);
        message.put("paymentMethod", paymentMethod);
        message.put("momoProvider", momoProvider);
        message.put("bankName", bankName);
        message.put("amount", BigDecimal.valueOf(amount));
        message.put("currency", currency);
        message.put("termMonths", durationYears * 12);
        message.put("interestRate", BigDecimal.valueOf(interestRate));
        message.put("purchaseDate", LocalDateTime.now().toString());

        rabbitTemplate.convertAndSend(RabbitMQConfig.PAYOUT_EXCHANGE, RabbitMQConfig.PAYOUT_KEY, message);
        log.info("Payout schedule published for investment: {}", investmentId);
    }
}
