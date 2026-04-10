package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.model.BrokerBondListing;
import com.bnr.bondpurchase.model.BondType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BrokerBondListingRepository extends JpaRepository<BrokerBondListing, UUID> {
    List<BrokerBondListing> findByBroker(Broker broker);
    // Returns brokers who have this bond type active, sorted by quantity descending
    List<BrokerBondListing> findByBondTypeAndBondType_StatusOrderByQuantityAvailableDesc(BondType bondType, BondStatus status);
    Optional<BrokerBondListing> findByBrokerAndBondType(Broker broker, BondType bondType);
}
