package com.urbanfresh.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.urbanfresh.model.Product;

/**
 * Repository Layer – Spring Data JPA repository for Product entities.
 * Provides derived queries for the landing page featured and near-expiry sections.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Retrieves all products marked as featured (featured = true).
     * Used by the landing page "Featured Products" section.
     *
     * @return list of featured products, empty list when none exist
     */
    List<Product> findByFeaturedTrue();

    /**
     * Retrieves in-stock products whose expiry date falls within [today, cutoff].
     * Ordered by earliest expiry so the most urgent offers appear first.
     *
     * @param today   the current date (inclusive start of window)
     * @param cutoff  the last acceptable expiry date (e.g. today + 7 days)
     * @param minStock minimum stock threshold (pass 0 to exclude zero-stock items)
     * @return list of near-expiry, in-stock products
     */
    List<Product> findByExpiryDateBetweenAndStockQuantityGreaterThanOrderByExpiryDateAsc(
            LocalDate today,
            LocalDate cutoff,
            int minStock
    );
}
