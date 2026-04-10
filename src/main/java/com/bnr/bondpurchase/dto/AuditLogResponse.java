package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AuditLogResponse {
    private UUID id;
    private String adminEmail;
    private String action;
    private String targetType;
    private String targetId;
    private String details;
    private LocalDateTime performedAt;
}
