package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.BondPurchaseRequest;
import com.bnr.bondpurchase.entity.BondPurchase;
import com.bnr.bondpurchase.service.BondPurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bonds")
@RequiredArgsConstructor
public class BondPurchaseController {

    private final BondPurchaseService bondPurchaseService;

    /**
     * POST /api/bonds/purchase
     * Investor submits a bond purchase request.
     * Triggers immediate payment via RabbitMQ → payment-service.
     */
    @PostMapping("/purchase")
    public ResponseEntity<BondPurchase> purchase(@RequestBody BondPurchaseRequest request) {
        BondPurchase bond = bondPurchaseService.createPurchase(request);
        return ResponseEntity.ok(bond);
    }

    /**
     * GET /api/bonds/all
     * Admin: list all bond purchases.
     */
    @GetMapping("/all")
    public ResponseEntity<List<BondPurchase>> getAllBonds() {
        return ResponseEntity.ok(bondPurchaseService.getAllBonds());
    }

    /**
     * GET /api/bonds/investor/{investorId}
     * Get all bonds for a specific investor.
     */
    @GetMapping("/investor/{investorId}")
    public ResponseEntity<List<BondPurchase>> getByInvestor(@PathVariable String investorId) {
        return ResponseEntity.ok(bondPurchaseService.getBondsByInvestor(investorId));
    }

    /**
     * GET /api/bonds/active
     * List all currently active bonds (used by payout scheduler internally).
     */
    @GetMapping("/active")
    public ResponseEntity<List<BondPurchase>> getActiveBonds() {
        return ResponseEntity.ok(bondPurchaseService.getActiveBonds());
    }
}
