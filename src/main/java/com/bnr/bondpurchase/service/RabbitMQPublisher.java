package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RabbitMQPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishPayoutSchedule(UUID investmentId, String payoutAccount, Double amountInvested, Double interestRate, Integer durationYears) {

        // We pack the required data into a Map (JSON) to send over the queue
        Map<String, Object> message = new HashMap<>();
        message.put("investmentId", investmentId);
        message.put("payoutAccount", payoutAccount);
        message.put("amountInvested", amountInvested);
        message.put("interestRate", interestRate);
        message.put("durationYears", durationYears);

        // Send it to the queue!
        rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_NAME, message);
        System.out.println("Published payout schedule to RabbitMQ for Investment ID: " + investmentId);
    }
}