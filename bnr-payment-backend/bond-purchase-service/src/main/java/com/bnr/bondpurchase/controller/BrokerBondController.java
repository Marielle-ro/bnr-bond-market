package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.BrokerBondListingRequest;
import com.bnr.bondpurchase.dto.BrokerBondListingResponse;
import com.bnr.bondpurchase.service.BrokerBondService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/broker/bonds")
@RequiredArgsConstructor
public class BrokerBondController {

    private final BrokerBondService brokerBondService;

    @PostMapping
    public ResponseEntity<BrokerBondListingResponse> addListing(
            @Valid @RequestBody BrokerBondListingRequest request,
            Authentication auth) {
        return ResponseEntity.ok(brokerBondService.addListing(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<BrokerBondListingResponse>> getMyListings(Authentication auth) {
        return ResponseEntity.ok(brokerBondService.getMyListings(auth.getName()));
    }
}
