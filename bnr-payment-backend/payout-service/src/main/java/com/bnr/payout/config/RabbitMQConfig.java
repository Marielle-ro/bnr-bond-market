package com.bnr.payout.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String PAYOUT_QUEUE    = "payout.queue";
    public static final String PAYOUT_EXCHANGE = "payout.exchange";
    public static final String PAYOUT_KEY      = "payout.routingkey";
    public static final String PAYOUT_DLQ      = "payout.dlq";

    @Bean
    public Queue payoutQueue() {
        return QueueBuilder.durable(PAYOUT_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", PAYOUT_DLQ)
                .build();
    }

    @Bean
    public Queue payoutDeadLetterQueue() {
        return new Queue(PAYOUT_DLQ, true);
    }

    @Bean
    public DirectExchange payoutExchange() {
        return new DirectExchange(PAYOUT_EXCHANGE);
    }

    @Bean
    public Binding payoutBinding() {
        return BindingBuilder.bind(payoutQueue()).to(payoutExchange()).with(PAYOUT_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
