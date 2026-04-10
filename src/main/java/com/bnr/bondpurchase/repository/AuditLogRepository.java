package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findAllByOrderByPerformedAtDesc();
}
