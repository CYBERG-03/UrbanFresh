package com.urbanfresh.model;

/**
 * Domain Layer - Enum representing the status of a purchase order 
 * directed to a supplier.
 */
public enum PurchaseOrderStatus {
    PENDING,
    ACCEPTED,
    SHIPPED,
    DELIVERED,
    COMPLETED,
    CANCELLED
}
