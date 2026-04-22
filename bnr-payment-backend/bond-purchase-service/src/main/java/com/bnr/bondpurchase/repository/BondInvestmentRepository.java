package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.model.BondInvestment;
import com.bnr.bondpurchase.model.BrokerBondListing;
import com.bnr.bondpurchase.model.User;
import com.bnr.bondpurchase.enums.InvestmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BondInvestmentRepository extends JpaRepository<BondInvestment, UUID> {    // Used for the investor's dashboard to see all the bonds they bought
    List<BondInvestment> findByInvestor(User investor);

    Optional<BondInvestment> findFirstByInvestorAndBrokerBondListingAndStatus(
            User investor, BrokerBondListing listing, InvestmentStatus status
    );

    boolean existsByInvestor_IdAndBrokerBondListing_IdAndStatus(
            UUID investorId, UUID brokerBondListingId, InvestmentStatus status
    );

    // We'll use this to find the highest sequential number when generating a new bond number
    long count();
}