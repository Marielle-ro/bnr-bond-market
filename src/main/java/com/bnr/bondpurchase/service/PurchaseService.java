package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.InvestmentResponse;
import com.bnr.bondpurchase.dto.PurchaseRequest;
import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.model.BondInvestment;
import com.bnr.bondpurchase.model.BrokerBondListing;
import com.bnr.bondpurchase.model.User;
import com.bnr.bondpurchase.repository.BondInvestmentRepository;
import com.bnr.bondpurchase.repository.BrokerBondListingRepository;
import com.bnr.bondpurchase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final BondInvestmentRepository bondRepository;
    private final UserRepository userRepository;
    private final BrokerBondListingRepository listingRepository;
    private final RabbitMQPublisher rabbitPublisher;

    @Transactional
    public InvestmentResponse purchaseBond(String investorEmail, PurchaseRequest request) {
        User investor = userRepository.findByEmail(investorEmail)
                .orElseThrow(() -> new RuntimeException("Investor not found"));

        BrokerBondListing listing = listingRepository.findById(request.getBrokerBondListingId())
                .orElseThrow(() -> new RuntimeException("Bond listing not found"));

        if (listing.getBondType().getStatus() != BondStatus.ACTIVE) {
            throw new RuntimeException("This bond type is no longer accepted by BNR");
        }

        if (listing.getQuantityAvailable() <= 0) {
            throw new RuntimeException("No bonds available from this broker");
        }

        // Decrement quantity
        listing.setQuantityAvailable(listing.getQuantityAvailable() - 1);
        listing.setUpdatedAt(LocalDateTime.now());
        listingRepository.save(listing);

        String bondNumber = generateBondNumber(listing.getBondType().getDurationYears());

        BondInvestment investment = new BondInvestment();
        investment.setInvestor(investor);
        investment.setBrokerBondListing(listing);
        investment.setAmountInvested(request.getAmount());
        investment.setBondNumber(bondNumber);
        investment.setPurchaseDate(LocalDateTime.now());

        BondInvestment saved = bondRepository.save(investment);

        rabbitPublisher.publishPayoutSchedule(
                saved.getId(),
                investor.getPayoutAccount(),
                request.getAmount(),
                listing.getBondType().getCouponRate(),
                listing.getBondType().getDurationYears()
        );

        return mapToResponse(saved);
    }

    public List<InvestmentResponse> getInvestorPortfolio(String investorEmail) {
        User investor = userRepository.findByEmail(investorEmail)
                .orElseThrow(() -> new RuntimeException("Investor not found"));
        return bondRepository.findByInvestor(investor).stream().map(this::mapToResponse).toList();
    }

    private String generateBondNumber(Integer durationYears) {
        long nextId = bondRepository.count() + 1;
        return "RWB0" + durationYears + "y" + String.format("%06d", nextId);
    }

    private InvestmentResponse mapToResponse(BondInvestment investment) {
        BrokerBondListing listing = investment.getBrokerBondListing();
        return InvestmentResponse.builder()
                .id(investment.getId())
                .bondName(listing.getBondType().getName())
                .durationYears(listing.getBondType().getDurationYears())
                .couponRate(listing.getBondType().getCouponRate())
                .brokerFee(listing.getBrokerFee())
                .amountInvested(investment.getAmountInvested())
                .bondNumber(investment.getBondNumber())
                .purchaseDate(investment.getPurchaseDate())
                .status(investment.getStatus().name())
                .brokerCompanyName(listing.getBroker().getCompanyName())
                .build();
    }
}
