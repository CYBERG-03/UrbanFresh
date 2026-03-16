/**
 * Service Layer – API calls for Stripe payment operations.
 * All requests use the authenticated Axios instance from api.js.
 */

import api from './api';

/**
 * Creates a Stripe PaymentIntent for the given order.
 * POST /api/payments/create-intent
 *
 * The backend resolves the amount from the persisted order (never from the client)
 * and returns a clientSecret for use with Stripe Elements.
 *
 * @param {number} orderId - ID of the order to pay for
 * @returns {Promise<{clientSecret: string, publishableKey: string, paymentIntentId: string, orderId: number}>}
 */
export const createPaymentIntent = (orderId) =>
  api.post('/api/payments/create-intent', { orderId }).then((res) => res.data);
