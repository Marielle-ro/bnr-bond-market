package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.BondPurchaseRequest;
import com.bnr.bondpurchase.entity.BondPurchase;
import com.bnr.bondpurchase.producer.BondPurchaseProducer;
import com.bnr.bondpurchase.repository.BondPurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BondPurchaseService {

    private final BondPurchaseRepository bondPurchaseRepository;
    private final BondPurchaseProducer producer;

    public BondPurchase createPurchase(BondPurchaseRequest request) {
        // Persist bond
        BondPurchase bond = new BondPurchase();
        bond.setPurchaseId(UUID.randomUUID().toString());
        bond.setInvestorId(request.getInvestorId());
        bond.setInvestorPhone(request.getInvestorPhone());
        bond.setInvestorAccount(request.getInvestorAccount());
        bond.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        bond.setAmount(request.getAmount());
        bond.setCurrency(request.getCurrency() != null ? request.getCurrency() : "RWF");
        bond.setInterestRate(request.getInterestRate());
        bond.setTermMonths(request.getTermMonths());
        bond.setStatus("ACTIVE");
        bond.setPurchaseDate(LocalDateTime.now());
        bond.setMaturityDate(LocalDateTime.now().plusMonths(request.getTermMonths()));
        bond.setPayoutCount(0);
        bondPurchaseRepository.save(bond);

        // Build queue message
        request.setPurchaseId(bond.getPurchaseId());
        request.setPurchaseDate(bond.getPurchaseDate());
        request.setCurrency(bond.getCurrency());
        request.setPaymentMethod(bond.getPaymentMethod());

        // Send to payment-service via RabbitMQ
        producer.sendPaymentRequest(request);

        log.info("📤 Bond purchase created and sent to payment queue: {}", bond.getPurchaseId());
        return bond;
    }

    public List<BondPurchase> getAllBonds() {
        return bondPurchaseRepository.findAll();
    }

    public List<BondPurchase> getBondsByInvestor(String investorId) {
        return bondPurchaseRepository.findByInvestorId(investorId);
    }

    public List<BondPurchase> getActiveBonds() {
        return bondPurchaseRepository.findByStatus("ACTIVE");
    }
}
