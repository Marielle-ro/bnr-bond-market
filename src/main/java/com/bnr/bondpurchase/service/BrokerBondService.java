package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.BrokerBondListingRequest;
import com.bnr.bondpurchase.dto.BrokerBondListingResponse;
import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.model.BondType;
import com.bnr.bondpurchase.model.BrokerBondListing;
import com.bnr.bondpurchase.repository.BondTypeRepository;
import com.bnr.bondpurchase.repository.BrokerBondListingRepository;
import com.bnr.bondpurchase.repository.BrokerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BrokerBondService {

    private final BrokerBondListingRepository listingRepository;
    private final BrokerRepository brokerRepository;
    private final BondTypeRepository bondTypeRepository;

    public BrokerBondListingResponse addListing(String brokerEmail, BrokerBondListingRequest request) {
        Broker broker = brokerRepository.findByEmail(brokerEmail)
                .orElseThrow(() -> new RuntimeException("Broker not found"));

        BondType bondType = bondTypeRepository.findById(request.getBondTypeId())
                .orElseThrow(() -> new RuntimeException("Bond type not found"));

        if (bondType.getStatus() != BondStatus.ACTIVE) {
            throw new RuntimeException("This bond type is not currently accepted by BNR");
        }

        // If broker already has this bond type listed, update it instead of creating a duplicate
        BrokerBondListing listing = listingRepository.findByBrokerAndBondType(broker, bondType)
                .orElse(new BrokerBondListing());

        listing.setBroker(broker);
        listing.setBondType(bondType);
        listing.setQuantityAvailable(request.getQuantityAvailable());
        listing.setBrokerFee(request.getBrokerFee());
        listing.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(listingRepository.save(listing));
    }

    public List<BrokerBondListingResponse> getMyListings(String brokerEmail) {
        Broker broker = brokerRepository.findByEmail(brokerEmail)
                .orElseThrow(() -> new RuntimeException("Broker not found"));
        return listingRepository.findByBroker(broker).stream().map(this::mapToResponse).toList();
    }

    // Investors use this — shows all brokers for a bond type, sorted descending by quantity they have for eac bond
    public List<BrokerBondListingResponse> getBrokersForBondType(UUID bondTypeId) {
        BondType bondType = bondTypeRepository.findById(bondTypeId)
                .orElseThrow(() -> new RuntimeException("Bond type not found"));
        return listingRepository
                .findByBondTypeAndBondType_StatusOrderByQuantityAvailableDesc(bondType, BondStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BrokerBondListingResponse mapToResponse(BrokerBondListing listing) {
        return BrokerBondListingResponse.builder()
                .id(listing.getId())
                .brokerBondListingId(listing.getId())
                .brokerCompanyName(listing.getBroker().getCompanyName())
                .collectionAccount(listing.getBroker().getCollectionAccount())
                .bondName(listing.getBondType().getName())
                .durationYears(listing.getBondType().getDurationYears())
                .couponRate(listing.getBondType().getCouponRate())
                .brokerFee(listing.getBrokerFee())
                .quantityAvailable(listing.getQuantityAvailable())
                .build();
    }
}
