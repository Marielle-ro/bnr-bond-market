package com.bnr.payout.consumer;

import com.bnr.payout.entity.PayoutRecord;
import com.bnr.payout.repository.PayoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payouts")
@RequiredArgsConstructor
public class PayoutController {

    private final PayoutRepository payoutRepository;

    @GetMapping("/all")
    public ResponseEntity<List<PayoutRecord>> getAllPayouts() {
        return ResponseEntity.ok(payoutRepository.findAll());
    }

    @GetMapping("/investor/{investorId}")
    public ResponseEntity<List<PayoutRecord>> getByInvestor(@PathVariable String investorId) {
        return ResponseEntity.ok(payoutRepository.findByInvestorId(investorId));
    }

    @GetMapping("/purchase/{purchaseId}")
    public ResponseEntity<List<PayoutRecord>> getByPurchase(@PathVariable String purchaseId) {
        return ResponseEntity.ok(payoutRepository.findByPurchaseId(purchaseId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PayoutRecord>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(payoutRepository.findByStatus(status.toUpperCase()));
    }
}
