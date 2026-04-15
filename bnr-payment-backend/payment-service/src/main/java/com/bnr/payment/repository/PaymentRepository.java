package com.bnr.payment.repository;

import com.bnr.payment.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentRecord, Long> {
    List<PaymentRecord> findByInvestorId(String investorId);
    List<PaymentRecord> findByPurchaseId(String purchaseId);
    List<PaymentRecord> findByStatus(String status);
}
