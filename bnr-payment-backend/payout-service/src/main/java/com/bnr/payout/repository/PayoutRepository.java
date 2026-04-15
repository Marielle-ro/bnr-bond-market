package com.bnr.payout.repository;

import com.bnr.payout.entity.PayoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<PayoutRecord, Long> {
    List<PayoutRecord> findByInvestorId(String investorId);
    List<PayoutRecord> findByPurchaseId(String purchaseId);
    List<PayoutRecord> findByStatus(String status);
}
