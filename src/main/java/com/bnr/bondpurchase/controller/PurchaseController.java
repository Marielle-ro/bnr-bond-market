package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.InvestmentResponse;
import com.bnr.bondpurchase.dto.PurchaseRequest;
import com.bnr.bondpurchase.service.PurchaseService;
import com.bnr.bondpurchase.service.ReceiptPdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final ReceiptPdfService receiptPdfService;

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

    @GetMapping("/{investmentId}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable UUID investmentId) {
        byte[] pdf = receiptPdfService.generateReceipt(investmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=receipt-" + investmentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}