package com.urbanfresh.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanfresh.dto.request.RegisterRequest;
import com.urbanfresh.dto.response.RegisterResponse;
import com.urbanfresh.exception.DuplicateEmailException;
import com.urbanfresh.model.Role;
import com.urbanfresh.model.User;
import com.urbanfresh.repository.UserRepository;
import com.urbanfresh.service.AuthService;

import lombok.RequiredArgsConstructor;

/**
 * Service Layer – Implements authentication operations.
 * Handles registration business logic: duplicate check, password hashing, persistence.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new customer.
     * Checks for duplicate email, hashes the password, saves the user,
     * and returns a safe response (no password exposed).
     */
    @Override
    @Transactional
    public RegisterResponse registerCustomer(RegisterRequest request) {
        // Reject if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER) // Public registration is always CUSTOMER
                .build();

        User saved = userRepository.save(user);

        return RegisterResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .role(saved.getRole().name())
                .message("Registration successful")
                .build();
    }
}
