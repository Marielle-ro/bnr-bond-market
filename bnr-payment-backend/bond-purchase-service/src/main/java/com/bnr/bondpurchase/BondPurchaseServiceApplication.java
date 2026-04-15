package com.bnr.bondpurchase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BondPurchaseServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BondPurchaseServiceApplication.class, args);
    }
}
