package com.urbanfresh.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

/**
 * Response Layer – DTO for displaying delivery personnel in admin panel.
 * Contains account info and activation status for management.
 * Excludes password for security.
 */
@Getter
@Builder
public class DeliveryPersonnelResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
