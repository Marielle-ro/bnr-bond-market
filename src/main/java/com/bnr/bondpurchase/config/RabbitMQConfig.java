package com.bnr.bondpurchase.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "payout.schedule";

    // This creates the queue in RabbitMQ if it doesn't already exist
    @Bean
    public Queue payoutQueue() {
        return new Queue(QUEUE_NAME, true); // true = durable (survives restarts)
    }

    // This tells RabbitMQ to send our messages as JSON so the Payment Service can read them easily
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}