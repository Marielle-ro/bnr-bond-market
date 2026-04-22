package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.enums.BondStatus;
import com.bnr.bondpurchase.model.BondType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BondTypeRepository extends JpaRepository<BondType, UUID> {
    List<BondType> findByStatus(BondStatus status);
}
