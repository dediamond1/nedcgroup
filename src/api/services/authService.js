import api from '../api';
import { AUTH_ROUTES } from '../routes';
import { handleApiSuccess, handleApiError } from '../api';

/**
 * Authentication service layer
 * Handles all auth-related API calls with proper error handling
 */

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with standardized format
 */
export const login = async (email, password) => {
  try {
    const response = await api.post(AUTH_ROUTES.LOGIN, {
      email,
      password,
    });

    if (response.ok) {
      return handleApiSuccess(response);
    }
    
    return handleApiError(response);
  } catch (error) {
    console.error('Login service error:', error);
    return handleApiError(error);
  }
};

/**
 * Verify PIN code for authentication
 * @param {Object} credentials - PIN verification credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {string} credentials.pinCode - PIN code to verify
 * @returns {Promise} API response with standardized format
 */
export const verifyPinCode = async ({ email, password, pinCode }) => {
  try {
    const response = await api.post(AUTH_ROUTES.PIN_CHECK, {
      email,
      password,
      pin: pinCode,
    });

    if (response.ok) {
      return handleApiSuccess(response);
    }
    
    return handleApiError(response);
  } catch (error) {
    console.error('PIN verification service error:', error);
    return handleApiError(error);
  }
};

/**
 * Confirm PIN code for checkout operations
 * @param {string} pinCode - PIN code to confirm
 * @param {Object} headers - Optional request headers (e.g. Authorization)
 * @returns {Promise} API response with standardized format
 */
export const confirmPinCode = async (pinCode, headers) => {
  try {
    const response = await api.post(
      AUTH_ROUTES.CONFIRM_PIN,
      { pincode: pinCode },
      headers ? { headers } : undefined
    );

    if (response.ok) {
      return handleApiSuccess(response);
    }

    return handleApiError(response);
  } catch (error) {
    console.error('Confirm PIN service error:', error);
    return handleApiError(error);
  }
};

/**
 * Logout user from the system
 * @returns {Promise} API response with standardized format
 */
export const logoutUser = async () => {
  try {
    const response = await api.post(AUTH_ROUTES.LOGOUT);

    if (response.ok) {
      return handleApiSuccess(response);
    }
    
    return handleApiError(response);
  } catch (error) {
    console.error('Logout service error:', error);
    return handleApiError(error);
  }
};

/**
 * Refresh authentication token
 * @returns {Promise} API response with standardized format
 */
export const refreshToken = async () => {
  try {
    const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN);

    if (response.ok) {
      return handleApiSuccess(response);
    }
    
    return handleApiError(response);
  } catch (error) {
    console.error('Token refresh service error:', error);
    return handleApiError(error);
  }
};

/**
 * Get user profile information
 * @returns {Promise} API response with standardized format
 */
export const getProfile = async () => {
  try {
    const response = await api.get(AUTH_ROUTES.PROFILE);

    if (response.ok) {
      return handleApiSuccess(response);
    }
    
    return handleApiError(response);
  } catch (error) {
    console.error('Get profile service error:', error);
    return handleApiError(error);
  }
};

/**
 * Passwordless login — request an email code (step 1).
 * @param {string} email
 */
export const requestLoginCode = async (email) => {
  try {
    const response = await api.post('/api/auth/request-code', { email });
    if (response.ok) {
      return handleApiSuccess(response);
    }
    return handleApiError(response);
  } catch (error) {
    console.error('Request code service error:', error);
    return handleApiError(error);
  }
};

/**
 * Passwordless login — verify the emailed code (step 2) → final token.
 * @param {{ email: string, code: string }} payload
 */
export const verifyLoginCode = async ({ email, code }) => {
  try {
    const response = await api.post('/api/auth/verify-code', { email, code });
    if (response.ok) {
      return handleApiSuccess(response);
    }
    return handleApiError(response);
  } catch (error) {
    console.error('Verify code service error:', error);
    return handleApiError(error);
  }
};

export default {
  login,
  verifyPinCode,
  confirmPinCode,
  logoutUser,
  refreshToken,
  getProfile,
  requestLoginCode,
  verifyLoginCode,
};
