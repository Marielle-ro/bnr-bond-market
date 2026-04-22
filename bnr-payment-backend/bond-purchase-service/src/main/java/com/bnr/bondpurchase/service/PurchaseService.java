package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.InvestmentResponse;
import com.bnr.bondpurchase.dto.PurchaseRequest;
import com.bnr.bondpurchase.dto.UpdatePaymentDetailsRequest;
import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.enums.InvestmentStatus;
import com.bnr.bondpurchase.enums.UserRole;
import com.bnr.bondpurchase.model.BondInvestment;
import com.bnr.bondpurchase.model.BrokerBondListing;
import com.bnr.bondpurchase.model.User;
import com.bnr.bondpurchase.repository.BondInvestmentRepository;
import com.bnr.bondpurchase.repository.BrokerBondListingRepository;
import com.bnr.bondpurchase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseService {
    private static final double MINIMUM_INVESTMENT_AMOUNT = 100_000.0;

    private final BondInvestmentRepository bondRepository;
    private final UserRepository userRepository;
    private final BrokerBondListingRepository listingRepository;
    private final RabbitMQPublisher rabbitPublisher;
    private final RestTemplate restTemplate;
    private final ReceiptPdfService receiptPdfService;

    @Value("${payment.service.url:http://localhost:8082}")
    private String paymentServiceUrl;

    @Transactional
    public InvestmentResponse purchaseBond(String investorEmail, PurchaseRequest request) {
        User investor = getInvestorByEmail(investorEmail);

        BrokerBondListing listing = listingRepository.findById(request.getBrokerBondListingId())
                .orElseThrow(() -> new RuntimeException("Bond listing not found"));

        if (listing.getBondType().getStatus() != BondStatus.ACTIVE) {
            throw new RuntimeException("This bond type is no longer accepted by BNR");
        }

        if (listing.getQuantityAvailable() <= 0) {
            throw new RuntimeException("No bonds available from this broker");
        }

        validateMinimumInvestment(request.getAmount());
        String paymentMethod = normalize(request.getPaymentMethod());
        String momoProvider = normalize(request.getMomoProvider());
        String bankName = normalize(request.getBankName());
        String currency = "RWF";
        validatePaymentDetails(paymentMethod, momoProvider, bankName, request.getInvestorPhone(), request.getInvestorAccount());

        boolean hasPending = bondRepository.existsByInvestor_IdAndBrokerBondListing_IdAndStatus(
                investor.getId(), listing.getId(), InvestmentStatus.PENDING_PAYMENT
        );
        if (hasPending) {
            throw new RuntimeException(
                    "You already have an ongoing payment for this purchase. Use PATCH /api/purchases/{investmentId}/payment-details to update payment fields."
            );
        }

        double brokerFeeAmount = calculateBrokerFeeAmount(listing.getBrokerFee());
        double totalAmountToPay = request.getAmount() + brokerFeeAmount;

        // Decrement quantity
        listing.setQuantityAvailable(listing.getQuantityAvailable() - 1);
        listing.setUpdatedAt(LocalDateTime.now());
        listingRepository.save(listing);

        String bondNumber = generateBondNumber(listing.getBondType().getDurationYears());

        BondInvestment investment = new BondInvestment();
        investment.setInvestor(investor);
        investment.setBrokerBondListing(listing);
        investment.setAmountInvested(request.getAmount());
        investment.setBrokerFeeAmount(brokerFeeAmount);
        investment.setTotalAmountToPay(totalAmountToPay);
        investment.setCurrency(currency);
        investment.setPaymentMethod(paymentMethod);
        investment.setMomoProvider(momoProvider);
        investment.setBankName(bankName);
        investment.setInvestorPhone(request.getInvestorPhone());
        investment.setInvestorAccount(request.getInvestorAccount());
        investment.setBondNumber(bondNumber);
        investment.setPurchaseDate(LocalDateTime.now());
        investment.setStatus(InvestmentStatus.PENDING_PAYMENT);

        BondInvestment saved = bondRepository.save(investment);

        // 1. Publish to payment-service — collect money from investor
        rabbitPublisher.publishPaymentRequest(
                saved.getId(),
                investor.getId().toString(),
                saved.getInvestorPhone(),
                saved.getInvestorAccount(),
                saved.getPaymentMethod(),
                saved.getMomoProvider(),
                saved.getBankName(),
                saved.getTotalAmountToPay(),
                saved.getCurrency(),
                listing.getBondType().getDurationYears(),
                listing.getBondType().getCouponRate()
        );

        // 2. Publish to payout-service — schedule 6-month coupon payouts
        PayoutDispatchDetails payoutDetails = resolveAndValidatePayoutDetails(investor, paymentMethod);
        rabbitPublisher.publishPayoutSchedule(
                saved.getId(),
                investor.getId().toString(),
                payoutDetails.investorPhone(),
                payoutDetails.investorAccount(),
                payoutDetails.paymentMethod(),
                payoutDetails.momoProvider(),
                payoutDetails.bankName(),
                saved.getTotalAmountToPay(),
                listing.getBondType().getCouponRate(),
                listing.getBondType().getDurationYears(),
                saved.getCurrency()
        );

        return mapToResponse(saved);
    }

    public List<InvestmentResponse> getInvestorPortfolio(String investorEmail) {
        User investor = getInvestorByEmail(investorEmail);
        return bondRepository.findByInvestor(investor).stream().map(this::mapToResponse).toList();
    }

    public List<Map<String, Object>> getPaymentStatus(String investorEmail, UUID investmentId) {
        getInvestorByEmail(investorEmail);
        BondInvestment investment = bondRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!investment.getInvestor().getEmail().equalsIgnoreCase(investorEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied: this investment does not belong to you"
            );
        }

        String url = paymentServiceUrl + "/api/payments/purchase/" + investmentId;
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        List<Map<String, Object>> paymentRecords = response.getBody();
        syncInvestmentStatusFromPaymentRecords(investment, paymentRecords);
        return paymentRecords;
    }

    @Transactional
    public InvestmentResponse updatePendingPaymentDetails(String investorEmail, UUID investmentId, UpdatePaymentDetailsRequest request) {
        User investor = getInvestorByEmail(investorEmail);
        BondInvestment investment = bondRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!investment.getInvestor().getId().equals(investor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this investment does not belong to you");
        }
        if (investment.getStatus() != InvestmentStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Payment details can only be updated while payment is still pending");
        }

        // Minimal "Ongoing" Check
        List<Map<String, Object>> paymentRecords = fetchPaymentRecords(investmentId);
        boolean hasSuccess = paymentRecords.stream().anyMatch(r -> "SUCCESS".equalsIgnoreCase(String.valueOf(r.get("status"))));
        if (hasSuccess) {
            throw new RuntimeException("Payment has already been successfully processed.");
        }

        // If no records exist but the purchase was initiated very recently (e.g., within 30s), 
        // it's likely still being processed by the consumer.
        if (paymentRecords.isEmpty() && investment.getPurchaseDate().isAfter(LocalDateTime.now().minusSeconds(30))) {
            throw new RuntimeException("A payment transaction is currently ongoing. Please wait.");
        }

        String paymentMethod = normalizeOrExisting(request.getPaymentMethod(), investment.getPaymentMethod());
        String momoProvider = normalizeOrExisting(request.getMomoProvider(), investment.getMomoProvider());
        String bankName = normalizeOrExisting(request.getBankName(), investment.getBankName());
        String currency = "RWF";

        String investorPhone = request.getInvestorPhone() != null ? request.getInvestorPhone() : investment.getInvestorPhone();
        String investorAccount = request.getInvestorAccount() != null ? request.getInvestorAccount() : investment.getInvestorAccount();

        validatePaymentDetails(paymentMethod, momoProvider, bankName, investorPhone, investorAccount);

        investment.setPaymentMethod(paymentMethod);
        investment.setMomoProvider(momoProvider);
        investment.setBankName(bankName);
        investment.setInvestorPhone(investorPhone);
        investment.setInvestorAccount(investorAccount);
        investment.setCurrency(currency);
        BondInvestment saved = bondRepository.save(investment);

        rabbitPublisher.publishPaymentRequest(
                saved.getId(),
                investor.getId().toString(),
                saved.getInvestorPhone(),
                saved.getInvestorAccount(),
                saved.getPaymentMethod(),
                saved.getMomoProvider(),
                saved.getBankName(),
                saved.getTotalAmountToPay(),
                saved.getCurrency(),
                saved.getBrokerBondListing().getBondType().getDurationYears(),
                saved.getBrokerBondListing().getBondType().getCouponRate()
        );

        PayoutDispatchDetails payoutDetails = resolveAndValidatePayoutDetails(investor, saved.getPaymentMethod());
        rabbitPublisher.publishPayoutSchedule(
                saved.getId(),
                investor.getId().toString(),
                payoutDetails.investorPhone(),
                payoutDetails.investorAccount(),
                payoutDetails.paymentMethod(),
                payoutDetails.momoProvider(),
                payoutDetails.bankName(),
                saved.getTotalAmountToPay(),
                saved.getBrokerBondListing().getBondType().getCouponRate(),
                saved.getBrokerBondListing().getBondType().getDurationYears(),
                saved.getCurrency()
        );
        return mapToResponse(saved);
    }

    @Transactional
    public byte[] downloadInvestorReceipt(String investorEmail, UUID investmentId) {
        getInvestorByEmail(investorEmail);
        BondInvestment investment = bondRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));
        if (!investment.getInvestor().getEmail().equalsIgnoreCase(investorEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this investment does not belong to you");
        }
        List<Map<String, Object>> paymentRecords = fetchPaymentRecords(investmentId);
        syncInvestmentStatusFromPaymentRecords(investment, paymentRecords);
        return receiptPdfService.generateReceiptForInvestor(investorEmail, investmentId);
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
                .brokerFeeAmount(resolveBrokerFeeAmount(investment, listing))
                .amountInvested(investment.getAmountInvested())
                .totalAmountToPay(resolveTotalAmountToPay(investment, listing))
                .bondNumber(investment.getBondNumber())
                .purchaseDate(investment.getPurchaseDate())
                .status(investment.getStatus().name())
                .brokerCompanyName(listing.getBroker().getCompanyName())
                .build();
    }

    private User getInvestorByEmail(String investorEmail) {
        User user = userRepository.findByEmail(investorEmail)
                .orElseThrow(() -> new RuntimeException("Investor not found"));
        if (user.getRole() != UserRole.INVESTOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only investors can access this endpoint");
        }
        return user;
    }

    private void validateMinimumInvestment(Double amount) {
        if (amount == null || amount < MINIMUM_INVESTMENT_AMOUNT) {
            throw new RuntimeException("Minimum investment amount is 100000 RWF");
        }
    }

    private double calculateBrokerFeeAmount(Double listingBrokerFeeAmount) {
        return listingBrokerFeeAmount != null ? listingBrokerFeeAmount : 0.0;
    }

    private double resolveBrokerFeeAmount(BondInvestment investment, BrokerBondListing listing) {
        if (investment.getBrokerFeeAmount() != null) {
            return investment.getBrokerFeeAmount();
        }
        return calculateBrokerFeeAmount(listing.getBrokerFee());
    }

    private double resolveTotalAmountToPay(BondInvestment investment, BrokerBondListing listing) {
        if (investment.getTotalAmountToPay() != null) {
            return investment.getTotalAmountToPay();
        }
        return investment.getAmountInvested() + resolveBrokerFeeAmount(investment, listing);
    }

    private String normalize(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    private String normalizeOrExisting(String incomingValue, String existingValue) {
        String normalized = normalize(incomingValue);
        return normalized != null ? normalized : existingValue;
    }

    private void validatePaymentDetails(String paymentMethod, String momoProvider, String bankName, String investorPhone, String investorAccount) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new RuntimeException("paymentMethod is required and must be MOMO or BANK");
        }
        if (!"MOMO".equals(paymentMethod) && !"BANK".equals(paymentMethod)) {
            throw new RuntimeException("Unsupported paymentMethod: " + paymentMethod + ". Use MOMO or BANK");
        }
        if ("MOMO".equals(paymentMethod)) {
            if (momoProvider == null || momoProvider.isBlank()) {
                throw new RuntimeException("momoProvider is required for MOMO payments");
            }
            if (investorPhone == null || investorPhone.isBlank()) {
                throw new RuntimeException("investorPhone is required for MOMO payments");
            }
        } else {
            if (bankName == null || bankName.isBlank()) {
                throw new RuntimeException("bankName is required for BANK payments");
            }
            if (investorAccount == null || investorAccount.isBlank()) {
                throw new RuntimeException("investorAccount is required for BANK payments");
            }
        }
    }

    private PayoutDispatchDetails resolveAndValidatePayoutDetails(User investor, String selectedPaymentMethod) {
        String payoutMethod = normalize(investor.getPayoutMethod());
        String payoutAccount = investor.getPayoutAccount();
        String payoutBankName = normalize(investor.getPayoutBankName());

        if (payoutMethod == null || payoutMethod.isBlank()) {
            throw new RuntimeException("Payout profile is incomplete. Update your profile first with payout method and account");
        }
        if (payoutAccount == null || payoutAccount.isBlank()) {
            throw new RuntimeException("Payout profile is incomplete. Update your payout account in profile first");
        }

        String normalizedSelected = "MOMO".equals(selectedPaymentMethod) ? "MOMO" : "BANK";
        String normalizedPayout = normalizePayoutMethodForDispatch(payoutMethod);
        if (!normalizedSelected.equals(normalizedPayout)) {
            throw new RuntimeException(
                    "Your profile payout method is " + normalizedPayout
                            + ". To use " + normalizedSelected
                            + " for this purchase flow, update your profile payout details first."
            );
        }

        if ("BANK".equals(normalizedPayout)) {
            if (payoutBankName == null || payoutBankName.isBlank()) {
                throw new RuntimeException("Payout bank name is missing. Update your profile with payoutBankName first");
            }
            return new PayoutDispatchDetails("BANK", null, payoutBankName, null, payoutAccount);
        }

        String inferredProvider = inferMomoProviderFromPhone(payoutAccount);
        return new PayoutDispatchDetails("MOMO", inferredProvider, null, payoutAccount, null);
    }

    private String normalizePayoutMethodForDispatch(String payoutMethod) {
        if ("MOBILE_MONEY".equals(payoutMethod) || "MOMO".equals(payoutMethod)) {
            return "MOMO";
        }
        if ("BANK".equals(payoutMethod)) {
            return "BANK";
        }
        throw new RuntimeException("Unsupported payoutMethod in profile: " + payoutMethod + ". Use BANK or MOBILE_MONEY");
    }

    private String inferMomoProviderFromPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new RuntimeException("Payout account is required and must be a valid MOMO phone number");
        }
        if (phoneNumber.startsWith("078") || phoneNumber.startsWith("079")) {
            return "MTN";
        }
        if (phoneNumber.startsWith("072") || phoneNumber.startsWith("073")) {
            return "AIRTEL";
        }
        throw new RuntimeException(
                "Could not infer MOMO provider from payout account " + phoneNumber
                        + ". Use a valid Rwanda mobile number starting with 078/079 (MTN) or 072/073 (AIRTEL)"
        );
    }

    private List<Map<String, Object>> fetchPaymentRecords(UUID investmentId) {
        String url = paymentServiceUrl + "/api/payments/purchase/" + investmentId;
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return response.getBody();
    }

    private void syncInvestmentStatusFromPaymentRecords(BondInvestment investment, List<Map<String, Object>> paymentRecords) {
        if (paymentRecords == null || paymentRecords.isEmpty()) {
            return;
        }
        boolean hasSuccess = paymentRecords.stream()
                .map(r -> r.get("status"))
                .filter(s -> s != null)
                .map(Object::toString)
                .anyMatch("SUCCESS"::equalsIgnoreCase);
        if (hasSuccess && investment.getStatus() != InvestmentStatus.ACTIVE) {
            investment.setStatus(InvestmentStatus.ACTIVE);
            bondRepository.save(investment);
        }
    }

    private record PayoutDispatchDetails(
            String paymentMethod,
            String momoProvider,
            String bankName,
            String investorPhone,
            String investorAccount
    ) {}
}
