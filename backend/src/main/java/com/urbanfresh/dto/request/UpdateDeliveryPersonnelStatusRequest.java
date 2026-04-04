package com.urbanfresh.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request Layer – DTO for PATCH /api/admin/delivery-personnel/{id}/status.
 * Used to activate or deactivate a delivery personnel account.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDeliveryPersonnelStatusRequest {

    /** true = activate, false = deactivate the account. */
    private Boolean isActive;
}
