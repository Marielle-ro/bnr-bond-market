package com.bnr.bondpurchase.scheduler;

import com.bnr.bondpurchase.dto.BondPurchaseRequest;
import com.bnr.bondpurchase.entity.BondPurchase;
import com.bnr.bondpurchase.producer.BondPurchaseProducer;
import com.bnr.bondpurchase.repository.BondPurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PayoutScheduler {

    private final BondPurchaseRepository bondPurchaseRepository;
    private final BondPurchaseProducer producer;

    /**
     * Runs at 00:00 on the 1st day of every 6th month (Jan and Jul).
     * Triggers coupon/interest payouts to all active bond investors.
     *
     * To test quickly, change cron to: "0 * * * * *" (every minute)
     */
    @Scheduled(cron = "0 0 0 1 */6 *")
    public void triggerSemiAnnualPayouts() {
        log.info("⏰ [PAYOUT SCHEDULER] Running 6-month payout job at {}", LocalDateTime.now());

        List<BondPurchase> activeBonds = bondPurchaseRepository.findByStatus("ACTIVE");
        log.info("📋 Found {} active bonds to process", activeBonds.size());

        for (BondPurchase bond : activeBonds) {
            try {
                // Check if bond has matured
                if (LocalDateTime.now().isAfter(bond.getMaturityDate())) {
                    bond.setStatus("COMPLETED");
                    bondPurchaseRepository.save(bond);
                    log.info("✅ Bond {} marked as COMPLETED (matured)", bond.getPurchaseId());
                    continue;
                }

                // Semi-annual coupon = (principal * annualRate) / 2
                BigDecimal couponPayout = bond.getAmount()
                        .multiply(bond.getInterestRate())
                        .divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);

                BondPurchaseRequest payoutReq = new BondPurchaseRequest();
                payoutReq.setPurchaseId(bond.getPurchaseId());
                payoutReq.setInvestorId(bond.getInvestorId());
                payoutReq.setInvestorPhone(bond.getInvestorPhone());
                payoutReq.setInvestorAccount(bond.getInvestorAccount());
                payoutReq.setPaymentMethod(bond.getPaymentMethod());
                payoutReq.setAmount(couponPayout);
                payoutReq.setCurrency(bond.getCurrency());
                payoutReq.setPurchaseDate(bond.getPurchaseDate());
                payoutReq.setInterestRate(bond.getInterestRate());
                payoutReq.setTermMonths(bond.getTermMonths());

                producer.sendPayoutRequest(payoutReq);

                // Update payout tracking
                bond.setLastPayoutDate(LocalDateTime.now());
                bond.setPayoutCount(bond.getPayoutCount() + 1);
                bondPurchaseRepository.save(bond);

            } catch (Exception e) {
                log.error("❌ Failed to process payout for bond {}: {}", bond.getPurchaseId(), e.getMessage());
            }
        }

        log.info("✅ [PAYOUT SCHEDULER] Completed. Processed {} bonds.", activeBonds.size());
    }
}
