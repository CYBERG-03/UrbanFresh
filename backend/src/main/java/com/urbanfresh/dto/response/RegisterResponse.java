package com.urbanfresh.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO Layer – Returned to the client after successful registration.
 * Exposes only safe, non-sensitive user fields.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
public class RegisterResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String message;
}
