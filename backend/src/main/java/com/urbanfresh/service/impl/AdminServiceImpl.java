package com.urbanfresh.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanfresh.dto.request.CreateDeliveryPersonnelRequest;
import com.urbanfresh.dto.request.UpdateDeliveryPersonnelStatusRequest;
import com.urbanfresh.dto.response.AdminStatsResponse;
import com.urbanfresh.dto.response.DeliveryPersonnelResponse;
import com.urbanfresh.exception.DuplicateEmailException;
import com.urbanfresh.exception.UserNotFoundException;
import com.urbanfresh.model.Role;
import com.urbanfresh.model.User;
import com.urbanfresh.repository.ProductRepository;
import com.urbanfresh.repository.UserRepository;
import com.urbanfresh.service.AdminService;

import lombok.RequiredArgsConstructor;

/**
 * Service Layer – Implements admin business operations.
 * Aggregates data from the User and Product repositories.
 * Handles delivery personnel account management with validation and encryption.
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieve high-level platform statistics.
     * Uses JPA count queries to avoid loading full entity lists into memory.
     *
     * @return AdminStatsResponse with total user and product counts
     */
    @Override
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .build();
    }

    /**
     * Create a new delivery personnel account.
     * Validates unique email, hashes the password, and saves the user with DELIVERY role.
     *
     * @param request validated delivery personnel creation payload
     * @return DeliveryPersonnelResponse with created account info
     * @throws DuplicateEmailException if email is already registered
     */
    @Override
    @Transactional
    public DeliveryPersonnelResponse createDeliveryPersonnel(CreateDeliveryPersonnelRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.DELIVERY)
                .isActive(true) // New delivery personnel accounts are active by default
                .build();

        User saved = userRepository.save(user);
        return toDeliveryPersonnelResponse(saved);
    }

    /**
     * Retrieve all delivery personnel (paginated).
     *
     * @param pageable pagination and sorting parameters
     * @return page of delivery personnel
     */
    @Override
    public Page<DeliveryPersonnelResponse> getDeliveryPersonnel(Pageable pageable) {
        return userRepository.findByRole(Role.DELIVERY, pageable)
                .map(this::toDeliveryPersonnelResponse);
    }

    /**
     * Activate or deactivate a delivery personnel account by ID.
     *
     * @param deliveryPersonnelId unique identifier
     * @param request contains isActive flag
     * @return updated delivery personnel response
     * @throws UserNotFoundException if user not found
     */
    @Override
    @Transactional
    public DeliveryPersonnelResponse updateDeliveryPersonnelStatus(Long deliveryPersonnelId, UpdateDeliveryPersonnelStatusRequest request) {
        User user = userRepository.findById(deliveryPersonnelId)
                .orElseThrow(() -> new UserNotFoundException("Delivery personnel not found with ID: " + deliveryPersonnelId));

        user.setIsActive(request.getIsActive());
        User updated = userRepository.save(user);
        return toDeliveryPersonnelResponse(updated);
    }

    /** Map User entity → DeliveryPersonnelResponse DTO. Centralised to keep mapping DRY. */
    private DeliveryPersonnelResponse toDeliveryPersonnelResponse(User user) {
        return DeliveryPersonnelResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
