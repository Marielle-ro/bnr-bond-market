package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.InvestmentResponse;
import com.bnr.bondpurchase.dto.PurchaseRequest;
import com.bnr.bondpurchase.dto.UpdatePaymentDetailsRequest;
import com.bnr.bondpurchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<InvestmentResponse> purchaseBond(
            @RequestBody PurchaseRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(purchaseService.purchaseBond(authentication.getName(), request));
    }

    @GetMapping("/my-bonds")
    public ResponseEntity<List<InvestmentResponse>> getMyPortfolio(Authentication authentication) {
        return ResponseEntity.ok(purchaseService.getInvestorPortfolio(authentication.getName()));
    }

    @GetMapping("/{investmentId}/payment-status")
    public ResponseEntity<List<Map<String, Object>>> getPaymentStatus(
            @PathVariable UUID investmentId,
            Authentication authentication) {
        return ResponseEntity.ok(purchaseService.getPaymentStatus(authentication.getName(), investmentId));
    }

    @PatchMapping("/{investmentId}/payment-details")
    public ResponseEntity<InvestmentResponse> updatePaymentDetails(
            @PathVariable UUID investmentId,
            @RequestBody UpdatePaymentDetailsRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                purchaseService.updatePendingPaymentDetails(authentication.getName(), investmentId, request)
        );
    }

    @GetMapping("/{investmentId}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable UUID investmentId, Authentication authentication) {
        byte[] pdf = purchaseService.downloadInvestorReceipt(authentication.getName(), investmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=receipt-" + investmentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}