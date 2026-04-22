package com.bnr.bondpurchase.service;

import com.bnr.bondpurchase.dto.*;
import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.enums.BrokerStatus;
import com.bnr.bondpurchase.model.*;
import com.bnr.bondpurchase.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bnr.bondpurchase.dto.InvestorBondsResponse;
import com.bnr.bondpurchase.enums.UserRole;
import com.bnr.bondpurchase.model.BrokerBondListing;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BrokerRepository brokerRepository;
    private final UserRepository userRepository;
    private final BondTypeRepository bondTypeRepository;
    private final BondInvestmentRepository bondInvestmentRepository;
    private final AuditLogRepository auditLogRepository;

    // --- BROKER MANAGEMENT ---

    public List<AdminBrokerResponse> getAllBrokers() {
        return brokerRepository.findAll().stream()
                .filter(b -> b.getStatus() != BrokerStatus.REJECTED)
                .map(b -> AdminBrokerResponse.builder()
                        .id(b.getId())
                        .displayId(b.getDisplayId())
                        .companyName(b.getCompanyName())
                        .email(b.getEmail())
                        .collectionAccount(b.getCollectionAccount())
                        .status(b.getStatus().name())
                        .rdbCertificateUrl(b.getRdbCertificateUrl())
                        .build())
                .toList();
    }

    public AdminBrokerResponse approveBroker(String adminEmail, UUID brokerId) {
        Broker broker = brokerRepository.findById(brokerId)
                .orElseThrow(() -> new RuntimeException("Broker not found"));

        if (broker.getStatus() != BrokerStatus.PENDING) {
            throw new RuntimeException("Only PENDING brokers can be approved");
        }

        broker.setStatus(BrokerStatus.APPROVED);
        brokerRepository.save(broker);
        log(adminEmail, "APPROVED_BROKER", "Broker", brokerId.toString(),
                "Broker " + broker.getCompanyName() + " has been approved");
        return mapToBrokerResponse(broker);
    }

    public AdminBrokerResponse rejectBroker(String adminEmail, UUID brokerId) {
        Broker broker = brokerRepository.findById(brokerId)
                .orElseThrow(() -> new RuntimeException("Broker not found"));

        if (broker.getStatus() != BrokerStatus.PENDING) {
            throw new RuntimeException("Only PENDING brokers can be rejected");
        }

        broker.setStatus(BrokerStatus.REJECTED);
        brokerRepository.save(broker);
        log(adminEmail, "REJECTED_BROKER", "Broker", brokerId.toString(),
                "Broker " + broker.getCompanyName() + " has been rejected");
        return mapToBrokerResponse(broker);
    }

    public AdminBrokerResponse suspendBroker(String adminEmail, UUID brokerId, String reason) {
        Broker broker = brokerRepository.findById(brokerId)
                .orElseThrow(() -> new RuntimeException("Broker not found"));

        if (broker.getStatus() != BrokerStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED brokers can be suspended");
        }

        broker.setStatus(BrokerStatus.SUSPENDED);
        brokerRepository.save(broker);
        log(adminEmail, "SUSPENDED_BROKER", "Broker", brokerId.toString(),
                "Broker " + broker.getCompanyName() + " suspended. Reason: " + reason);
        return mapToBrokerResponse(broker);
    }

    public AdminBrokerResponse reactivateBroker(String adminEmail, UUID brokerId) {
        Broker broker = brokerRepository.findById(brokerId)
                .orElseThrow(() -> new RuntimeException("Broker not found"));

        if (broker.getStatus() != BrokerStatus.SUSPENDED) {
            throw new RuntimeException("Only SUSPENDED brokers can be reactivated");
        }

        broker.setStatus(BrokerStatus.APPROVED);
        brokerRepository.save(broker);
        log(adminEmail, "REACTIVATED_BROKER", "Broker", brokerId.toString(),
                "Broker " + broker.getCompanyName() + " has been reactivated");
        return mapToBrokerResponse(broker);
    }

    private AdminBrokerResponse mapToBrokerResponse(Broker b) {
        return AdminBrokerResponse.builder()
                .id(b.getId())
                .displayId(b.getDisplayId())
                .companyName(b.getCompanyName())
                .email(b.getEmail())
                .collectionAccount(b.getCollectionAccount())
                .status(b.getStatus().name())
                .rdbCertificateUrl(b.getRdbCertificateUrl())
                .build();
    }


    // --- BOND TYPE MANAGEMENT ---
    public BondTypeResponse createBondType(String adminEmail, BondTypeRequest request) {
        BondType bondType = new BondType();
        bondType.setName(request.getName());
        bondType.setDurationYears(request.getDurationYears());
        bondType.setCouponRate(request.getCouponRate());
        BondType saved = bondTypeRepository.save(bondType);
        log(adminEmail, "CREATED_BOND_TYPE", "BondType", saved.getId().toString(),
                "Created bond type: " + saved.getName());
        return mapToBondTypeResponse(saved);
    }

    public BondTypeResponse updateBondType(String adminEmail, UUID bondTypeId, BondTypeRequest request) {
        BondType bondType = bondTypeRepository.findById(bondTypeId)
                .orElseThrow(() -> new RuntimeException("Bond type not found"));
        bondType.setName(request.getName());
        bondType.setDurationYears(request.getDurationYears());
        bondType.setCouponRate(request.getCouponRate());
        bondType.setUpdatedAt(LocalDateTime.now());
        bondTypeRepository.save(bondType);
        log(adminEmail, "UPDATED_BOND_TYPE", "BondType", bondTypeId.toString(),
                "Updated bond type: " + bondType.getName());
        return mapToBondTypeResponse(bondType);
    }

    public BondTypeResponse toggleBondStatus(String adminEmail, UUID bondTypeId) {
        BondType bondType = bondTypeRepository.findById(bondTypeId)
                .orElseThrow(() -> new RuntimeException("Bond type not found"));
        BondStatus newStatus = bondType.getStatus() == BondStatus.ACTIVE ? BondStatus.INACTIVE : BondStatus.ACTIVE;
        bondType.setStatus(newStatus);
        bondType.setUpdatedAt(LocalDateTime.now());
        bondTypeRepository.save(bondType);
        log(adminEmail, newStatus.name() + "_BOND_TYPE", "BondType", bondTypeId.toString(),
                "Bond type " + bondType.getName() + " set to " + newStatus);
        return mapToBondTypeResponse(bondType);
    }

    public List<BondTypeResponse> getAllBondTypes() {
        return bondTypeRepository.findAll().stream().map(this::mapToBondTypeResponse).toList();
    }

    // --- DASHBOARD ---
    public AdminDashboardResponse getDashboard() {
        long totalInvestors = userRepository.count();
        long totalBrokers = brokerRepository.findAll().stream()
                .filter(b -> b.getStatus() != BrokerStatus.REJECTED)
                .count();
        long totalBondsPurchased = bondInvestmentRepository.count();
        double totalAmountInvested = bondInvestmentRepository.findAll()
                .stream().mapToDouble(BondInvestment::getAmountInvested).sum();

        return AdminDashboardResponse.builder()
                .totalInvestors(totalInvestors)
                .totalBrokers(totalBrokers)
                .totalBondsPurchased(totalBondsPurchased)
                .totalAmountInvested(totalAmountInvested)
                .build();
    }

    // --- MONTHLY BROKER RANKING ---
    @Transactional(readOnly = true)
    public List<TopBrokerResponse> getTopBrokersByMonth(int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);

        // Get all non-rejected brokers
        List<Broker> allBrokers = brokerRepository.findAll().stream()
                .filter(b -> b.getStatus() != BrokerStatus.REJECTED)
                .toList();

        // Get all investments in that month
        List<BondInvestment> monthlyInvestments = bondInvestmentRepository.findAll().stream()
                .filter(i -> i.getPurchaseDate() != null
                        && !i.getPurchaseDate().isBefore(start)
                        && i.getPurchaseDate().isBefore(end))
                .toList();

        // Map broker company name -> investments
        Map<String, List<BondInvestment>> byBroker = monthlyInvestments.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getBrokerBondListing().getBroker().getCompanyName()
                ));

        // Build response for ALL brokers, zero for those with no sales
        return allBrokers.stream()
                .map(broker -> {
                    List<BondInvestment> sales = byBroker.getOrDefault(broker.getCompanyName(), List.of());
                    return new TopBrokerResponse(
                            broker.getCompanyName(),
                            sales.size(),
                            sales.stream().mapToDouble(BondInvestment::getAmountInvested).sum()
                    );
                })
                .sorted((a, b) -> Long.compare(b.getTotalBondsSold(), a.getTotalBondsSold()))
                .toList();
    }

    // --- AUDIT LOGS ---
    public List<AuditLogResponse> getAuditLogs() {
        return auditLogRepository.findAllByOrderByPerformedAtDesc().stream()
                .map(a -> AuditLogResponse.builder()
                        .id(a.getId())
                        .adminEmail(a.getAdminEmail())
                        .action(a.getAction())
                        .targetType(a.getTargetType())
                        .targetId(a.getTargetId())
                        .details(a.getDetails())
                        .performedAt(a.getPerformedAt())
                        .build())
                .toList();
    }

    // --- USERS ---
    public long getTotalUsers() {
        return userRepository.count();
    }

    private void log(String adminEmail, String action, String targetType, String targetId, String details) {
        AuditLog log = new AuditLog();
        log.setAdminEmail(adminEmail);
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    private BondTypeResponse mapToBondTypeResponse(BondType b) {
        return BondTypeResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .durationYears(b.getDurationYears())
                .couponRate(b.getCouponRate())
                .status(b.getStatus().name())
                .build();
    }

    public List<InvestorBondsResponse> getAllInvestorsWithBonds() {
        return userRepository.findByRole(UserRole.INVESTOR).stream()
                .map(investor -> {
                    List<InvestmentResponse> bonds = bondInvestmentRepository
                            .findByInvestor(investor)
                            .stream()
                            .map(investment -> {
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
                            })
                            .toList();

                    return InvestorBondsResponse.builder()
                            .investorId(investor.getId())
                            .fullName(investor.getFullName())
                            .email(investor.getEmail())
                            .nationalId(investor.getNationalId())
                            .payoutAccount(investor.getPayoutAccount())
                            .bonds(bonds)
                            .build();
                })
                .toList();
    }
}
