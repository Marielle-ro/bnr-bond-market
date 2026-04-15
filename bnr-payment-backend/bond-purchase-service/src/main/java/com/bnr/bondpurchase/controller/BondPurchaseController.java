package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.BondPurchaseRequest;
import com.bnr.bondpurchase.dto.MomoProviderEnum;
import com.bnr.bondpurchase.dto.RwandaBankEnum;
import com.bnr.bondpurchase.entity.BondPurchase;
import com.bnr.bondpurchase.service.BondPurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    /**
     * GET /api/bonds/banks
     * Returns all Rwanda banks for frontend dropdown.
     */
    @GetMapping("/banks")
    public ResponseEntity<List<Map<String, String>>> getBanks() {
        List<Map<String, String>> banks = Arrays.stream(RwandaBankEnum.values())
                .map(b -> Map.of("code", b.name(), "name", b.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(banks);
    }

    /**
     * GET /api/bonds/momo-providers
     * Returns MoMo providers (MTN, AIRTEL) for frontend dropdown.
     */
    @GetMapping("/momo-providers")
    public ResponseEntity<List<Map<String, String>>> getMomoProviders() {
        List<Map<String, String>> providers = Arrays.stream(MomoProviderEnum.values())
                .map(p -> Map.of("code", p.name(), "name", p.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(providers);
    }
}
