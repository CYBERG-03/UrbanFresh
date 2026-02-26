package com.urbanfresh.service;

import com.urbanfresh.dto.request.RegisterRequest;
import com.urbanfresh.dto.response.RegisterResponse;

/**
 * Service Layer – Contract for authentication-related operations.
 * Keeps the controller decoupled from implementation details.
 */
public interface AuthService {

    /**
     * Register a new customer account.
     *
     * @param request validated registration data
     * @return response with the created user's public info
     * @throws com.urbanfresh.exception.DuplicateEmailException if email is taken
     */
    RegisterResponse registerCustomer(RegisterRequest request);
}
