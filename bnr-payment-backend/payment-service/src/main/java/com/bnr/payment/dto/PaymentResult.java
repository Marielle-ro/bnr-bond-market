package com.bnr.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResult {
    private String status;        // SUCCESS or FAILED
    private String transactionId;
    private String message;
}
