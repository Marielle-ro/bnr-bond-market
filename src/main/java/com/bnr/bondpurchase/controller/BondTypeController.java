package com.bnr.bondpurchase.controller;

import com.bnr.bondpurchase.dto.BondTypeResponse;
import com.bnr.bondpurchase.dto.BrokerBondListingResponse;
import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.repository.BondTypeRepository;
import com.bnr.bondpurchase.service.BrokerBondService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bonds")
@RequiredArgsConstructor
public class BondTypeController {

    private final BrokerBondService brokerBondService;
    private final BondTypeRepository bondTypeRepository;

    // Investors see all active bond types to pick from
    @GetMapping
    public ResponseEntity<List<BondTypeResponse>> getActiveBonds() {
        List<BondTypeResponse> bonds = bondTypeRepository.findByStatus(BondStatus.ACTIVE)
                .stream()
                .map(b -> BondTypeResponse.builder()
                        .id(b.getId())
                        .name(b.getName())
                        .durationYears(b.getDurationYears())
                        .couponRate(b.getCouponRate())
                        .status(b.getStatus().name())
                        .build())
                .toList();
        return ResponseEntity.ok(bonds);
    }

    // Investor picks a bond type → sees brokers sorted by quantity descending
    @GetMapping("/{bondTypeId}/brokers")
    public ResponseEntity<List<BrokerBondListingResponse>> getBrokersForBond(@PathVariable UUID bondTypeId) {
        return ResponseEntity.ok(brokerBondService.getBrokersForBondType(bondTypeId));
    }
}
