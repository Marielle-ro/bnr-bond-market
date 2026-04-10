package com.bnr.bondpurchase.model;

import com.bnr.bondpurchase.enums.InvestmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bond_investments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BondInvestment {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "investor_id")
    private User investor;

    @ManyToOne
    @JoinColumn(name = "broker_bond_listing_id")
    private BrokerBondListing brokerBondListing;

    private Double amountInvested;

    @Column(unique = true)
    private String bondNumber;

    private LocalDateTime purchaseDate;

    @Enumerated(EnumType.STRING)
    private InvestmentStatus status = InvestmentStatus.ACTIVE;
}
