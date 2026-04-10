package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.model.Broker;
import com.bnr.bondpurchase.enums.BrokerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BrokerRepository extends JpaRepository<Broker, UUID> {    Optional<Broker> findByEmail(String email);

    // Used by investors to see which brokers are available to buy from
    List<Broker> findByStatus(BrokerStatus status);
}