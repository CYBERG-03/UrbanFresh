/**
 * Service Layer – Axios calls for authentication endpoints.
 * Centralizes all auth API interactions; keeps components free of HTTP logic.
 * Uses the shared api instance for consistent interceptor behavior.
 */
import api from './api';

const AUTH_PATH = '/api/auth';

/**
 * Register a new customer account.
 * @param {object} data - { name, email, password, phone }
 * @returns {Promise} resolved with RegisterResponse on success
 * @throws axios error with response.data containing field errors or message
 */
export const registerCustomer = (data) =>
  api.post(`${AUTH_PATH}/register`, data);

/**
 * Authenticate a user and receive a JWT token.
 * @param {object} data - { email, password }
 * @returns {Promise} resolved with { token, email, name, role, message }
 * @throws axios error with response.data containing error message (401/400)
 */
export const loginUser = (data) =>
  api.post(`${AUTH_PATH}/login`, data);

