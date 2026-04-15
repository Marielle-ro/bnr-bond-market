package com.bnr.payment.consumer;

import com.bnr.payment.entity.PaymentRecord;
import com.bnr.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;

    @GetMapping("/all")
    public ResponseEntity<List<PaymentRecord>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/investor/{investorId}")
    public ResponseEntity<List<PaymentRecord>> getByInvestor(@PathVariable String investorId) {
        return ResponseEntity.ok(paymentRepository.findByInvestorId(investorId));
    }

    @GetMapping("/purchase/{purchaseId}")
    public ResponseEntity<List<PaymentRecord>> getByPurchase(@PathVariable String purchaseId) {
        return ResponseEntity.ok(paymentRepository.findByPurchaseId(purchaseId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentRecord>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(paymentRepository.findByStatus(status.toUpperCase()));
    }
}
