package com.urbanfresh.model;

/**
 * Domain Layer – Enum representing user roles in the system.
 * Used for JWT role-based access control across all endpoints.
 */
public enum Role {
    CUSTOMER,
    ADMIN,
    SUPPLIER,
    DELIVERY
}
