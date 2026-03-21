package com.urbanfresh.service.impl;

import com.urbanfresh.dto.AdminDashboardResponse;
import com.urbanfresh.repository.OrderRepository;
import com.urbanfresh.repository.ProductRepository;
import com.urbanfresh.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Admin Dashboard Service Implementation
 * Layer: Service (Business Logic)
 * Calculates KPI metrics and alert counts from repositories
 */
@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    
    @Override
    public AdminDashboardResponse getDashboardMetrics() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        
        // KPI Metrics
        response.setTotalOrders(orderRepository.count());
        response.setTotalRevenue(calculateTotalRevenue());
        response.setActiveSuppliersCount(0); // TODO: requires Supplier model in future sprint
        response.setTotalProductsCount(productRepository.count());
        
        // Alerts (placeholder - will be enhanced when inventory expires/low-stock tracking added)
        response.setLowStockItemsCount(0); // TODO: enhance with actual low-stock logic from SCRUM-25
        response.setNearExpiryItemsCount(0); // TODO: enhance when expiry dates tracked
        response.setWastePercentage(0.0); // TODO: calculate when waste metrics added
        
        // Summary
        AdminDashboardResponse.DashboardSummary summary = new AdminDashboardResponse.DashboardSummary();
        summary.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        summary.setStatusMessage("Dashboard metrics up to date");
        response.setSummary(summary);
        
        return response;
    }
    
    /**
     * Calculate total revenue from all confirmed orders
     * @return sum of totalAmount from CONFIRMED orders
     */
    private double calculateTotalRevenue() {
        // Fetch all confirmed orders and sum their totals
        return orderRepository.findAll().stream()
            .filter(order -> order.getStatus() != null && 
                           order.getStatus().toString().equals("CONFIRMED"))
            .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
            .sum();
    }
}
