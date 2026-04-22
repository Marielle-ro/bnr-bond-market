package com.bnr.bondpurchase.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminBrokerResponse {
    private UUID id;
    private Long displayId;
    private String companyName;
    private String email;
    private String collectionAccount;
    private String status;
    private String rdbCertificateUrl;
}
