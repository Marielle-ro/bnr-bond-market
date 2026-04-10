package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.InvestmentResponse;
import com.bnr.bondpurchase.dto.PurchaseRequest;
import com.bnr.bondpurchase.model.BondInvestment;
import com.bnr.bondpurchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<InvestmentResponse> purchaseBond(
            @RequestBody PurchaseRequest request,
            Authentication authentication
    ) {
        InvestmentResponse investment = purchaseService.purchaseBond(authentication.getName(), request);
        return ResponseEntity.ok(investment);
    }

    @GetMapping("/my-bonds")
    public ResponseEntity<List<InvestmentResponse>> getMyPortfolio(Authentication authentication) {
        return ResponseEntity.ok(purchaseService.getInvestorPortfolio(authentication.getName()));
    }
}