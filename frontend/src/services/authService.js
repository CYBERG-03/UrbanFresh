/**
 * Service Layer – Axios calls for authentication endpoints.
 * Centralizes all auth API interactions; keeps components free of HTTP logic.
 */
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';

/**
 * Register a new customer account.
 * @param {object} data - { name, email, password, phone }
 * @returns {Promise} resolved with RegisterResponse on success
 * @throws axios error with response.data containing field errors or message
 */
export const registerCustomer = (data) =>
  axios.post(`${API_BASE}/register`, data);
