package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.model.BondInvestment;
import com.bnr.bondpurchase.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BondInvestmentRepository extends JpaRepository<BondInvestment, UUID> {    // Used for the investor's dashboard to see all the bonds they bought
    List<BondInvestment> findByInvestor(User investor);

    // We'll use this to find the highest sequential number when generating a new bond number
    long count();
}