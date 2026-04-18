package com.urbanfresh.service;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.urbanfresh.exception.InsufficientLoyaltyPointsException;
import com.urbanfresh.model.LoyaltyPoints;
import com.urbanfresh.model.Role;
import com.urbanfresh.model.User;
import com.urbanfresh.repository.LoyaltyPointsRepository;
import com.urbanfresh.repository.UserRepository;
import com.urbanfresh.service.impl.LoyaltyServiceImpl;

/**
 * Test Layer – Verifies the loyalty points redemption logic introduced in SCRUM-40.
 * Covers all acceptance-criteria paths:
 *   1. Valid redemption applies the correct discount (1 pt = Rs. 5)
 *   2. Valid redemption increments redeemedPoints on the ledger after payment
 *   3. Over-redemption (more points than balance) is rejected
 *   4. Redemption whose discount exceeds the order total is rejected
 *   5. Customer with no ledger at all is rejected
 *
 * Uses Mockito only — no Spring context loaded.
 */
@ExtendWith(MockitoExtension.class)
class LoyaltyRedemptionServiceTest {

    @Mock private LoyaltyPointsRepository loyaltyPointsRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private LoyaltyServiceImpl loyaltyService;

    // ── Shared fixture ─────────────────────────────────────────────────────────

    private final User customer = User.builder()
            .id(1L).name("Jane Doe").email("jane@example.com").role(Role.CUSTOMER).build();

    // ── Test 1: Correct discount amount ───────────────────────────────────────

    /**
     * Validating 10 points on a Rs. 5000 order must return Rs. 50 discount (10 × 5).
     */
    @Test
    void validatePointsRedemption_returnsCorrectDiscount_forValidRedemption() {
        LoyaltyPoints ledger = LoyaltyPoints.builder()
                .customer(customer)
                .earnedPoints(20)    // totalPoints = 20 - 0 = 20
                .redeemedPoints(0)
                .build();

        when(loyaltyPointsRepository.findByCustomerId(customer.getId()))
                .thenReturn(Optional.of(ledger));

        BigDecimal discount = loyaltyService.validatePointsRedemption(customer, 10, BigDecimal.valueOf(5000));

        assertThat(discount).isEqualByComparingTo(BigDecimal.valueOf(50));
    }

    // ── Test 2: Ledger redeemedPoints incremented ─────────────────────────────

    /**
     * After payment confirmation, deductRedeemedPoints must increase redeemedPoints
     * by pointsToDeduct and save the updated ledger.
     */
    @Test
    void deductRedeemedPoints_incrementsRedeemedPointsAndSavesLedger() {
        LoyaltyPoints ledger = LoyaltyPoints.builder()
                .customer(customer)
                .earnedPoints(30)
                .redeemedPoints(5)   // existing redemptions
                .build();

        when(loyaltyPointsRepository.findByCustomerIdWithLock(customer.getId()))
                .thenReturn(Optional.of(ledger));

        loyaltyService.deductRedeemedPoints(customer, 10);

        ArgumentCaptor<LoyaltyPoints> captor = ArgumentCaptor.forClass(LoyaltyPoints.class);
        verify(loyaltyPointsRepository).save(captor.capture());

        LoyaltyPoints saved = captor.getValue();
        assertThat(saved.getRedeemedPoints()).isEqualTo(15);  // 5 existing + 10 new
        // earnedPoints must be untouched
        assertThat(saved.getEarnedPoints()).isEqualTo(30);
    }

    // ── Test 3: Over-redemption rejected ──────────────────────────────────────

    /**
     * Requesting more points than the available balance must throw
     * InsufficientLoyaltyPointsException — the ledger must not be saved.
     */
    @Test
    void validatePointsRedemption_throwsException_whenRequestedExceedsBalance() {
        LoyaltyPoints ledger = LoyaltyPoints.builder()
                .customer(customer)
                .earnedPoints(10)
                .redeemedPoints(5)   // totalPoints = 10 - 5 = 5
                .build();

        when(loyaltyPointsRepository.findByCustomerId(customer.getId()))
                .thenReturn(Optional.of(ledger));

        assertThatThrownBy(() ->
                loyaltyService.validatePointsRedemption(customer, 6, BigDecimal.valueOf(5000)))
                .isInstanceOf(InsufficientLoyaltyPointsException.class)
                .hasMessageContaining("Available: 5")
                .hasMessageContaining("requested: 6");
    }

    // ── Test 4: Discount exceeds order total ──────────────────────────────────

    /**
     * If pointsToRedeem × 5 > orderTotal the redemption must be rejected.
     * Prevents a customer from getting more discount than the order is worth.
     */
    @Test
    void validatePointsRedemption_throwsException_whenDiscountExceedsOrderTotal() {
        LoyaltyPoints ledger = LoyaltyPoints.builder()
                .customer(customer)
                .earnedPoints(100)
                .redeemedPoints(0)   // totalPoints = 100; potential discount = Rs. 500
                .build();

        when(loyaltyPointsRepository.findByCustomerId(customer.getId()))
                .thenReturn(Optional.of(ledger));

        // orderTotal is only Rs. 200, but 50 pts × 5 = Rs. 250 discount
        assertThatThrownBy(() ->
                loyaltyService.validatePointsRedemption(customer, 50, BigDecimal.valueOf(200)))
                .isInstanceOf(InsufficientLoyaltyPointsException.class)
                .hasMessageContaining("exceeds the order total")
                .hasMessageContaining("Maximum redeemable: 40");
    }

    // ── Test 5: No ledger exists ─────────────────────────────────────────────

    /**
     * A customer who has never placed an order has no loyalty ledger.
     * Attempting to redeem must throw InsufficientLoyaltyPointsException.
     */
    @Test
    void validatePointsRedemption_throwsException_whenNoLedgerExists() {
        when(loyaltyPointsRepository.findByCustomerId(customer.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                loyaltyService.validatePointsRedemption(customer, 5, BigDecimal.valueOf(1000)))
                .isInstanceOf(InsufficientLoyaltyPointsException.class)
                .hasMessageContaining("no loyalty points available");
    }
}
