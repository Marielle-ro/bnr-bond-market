package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.entity.BondPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BondPurchaseRepository extends JpaRepository<BondPurchase, Long> {
    List<BondPurchase> findByStatus(String status);
    List<BondPurchase> findByInvestorId(String investorId);
    Optional<BondPurchase> findByPurchaseId(String purchaseId);
}
