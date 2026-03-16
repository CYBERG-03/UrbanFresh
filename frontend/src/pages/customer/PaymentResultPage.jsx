/**
 * Page Layer – Payment result feedback page.
 * Displayed after a Stripe payment attempt succeeds or fails.
 * Reads the outcome from URL query parameters (?status=success|failed&orderId=…)
 * so the checkout page (built by another dev) can redirect here after confirmation.
 *
 * Scenario 1 – success: shows confirmation message, links to dashboard.
 * Scenario 2 – failure: shows clear failure message, links back to cart.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styles from './PaymentResultPage.module.css';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /** 'success' | 'failed' | null — resolved from the ?status= query param */
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  const [countdown, setCountdown] = useState(5);

  // Auto-redirect to dashboard on success after 5 seconds
  useEffect(() => {
    if (status !== 'success') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

  // Guard: redirect home if no valid status param present
  if (!status || (status !== 'success' && status !== 'failed')) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.subtitle}>Invalid payment result. Redirecting…</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${isSuccess ? styles.success : styles.failed}`}>
        {/* Status icon */}
        <div className={styles.iconWrap}>
          {isSuccess ? (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
        </div>

        {/* Heading */}
        <h1 className={styles.heading} id="payment-result-heading">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h1>

        {/* Message */}
        <p className={styles.subtitle}>
          {isSuccess
            ? `Your order${orderId ? ` #${orderId}` : ''} has been confirmed and is being prepared.`
            : 'Your payment could not be processed. No charge was made.'}
        </p>

        {/* Auto-redirect notice (success only) */}
        {isSuccess && (
          <p className={styles.countdown}>
            Redirecting to your dashboard in <strong>{countdown}</strong> second
            {countdown !== 1 ? 's' : ''}…
          </p>
        )}

        {/* Call-to-action buttons */}
        <div className={styles.actions}>
          {isSuccess ? (
            <Link to="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`} id="view-orders-btn">
              View My Orders
            </Link>
          ) : (
            <>
              <Link to="/cart" className={`${styles.btn} ${styles.btnPrimary}`} id="retry-payment-btn">
                Back to Cart
              </Link>
              <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`} id="go-dashboard-btn">
                My Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
