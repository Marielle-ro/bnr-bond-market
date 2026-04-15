package com.bnr.payment.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String PAYMENT_QUEUE    = "payment.queue";
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_KEY      = "payment.routingkey";
    public static final String PAYMENT_DLQ      = "payment.dlq";

    @Bean
    public Queue paymentQueue() {
        return QueueBuilder.durable(PAYMENT_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", PAYMENT_DLQ)
                .build();
    }

    @Bean
    public Queue paymentDeadLetterQueue() {
        return new Queue(PAYMENT_DLQ, true);
    }

    @Bean
    public DirectExchange paymentExchange() {
        return new DirectExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Binding paymentBinding() {
        return BindingBuilder.bind(paymentQueue()).to(paymentExchange()).with(PAYMENT_KEY);
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
