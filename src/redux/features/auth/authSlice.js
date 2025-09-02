import { createSlice } from '@reduxjs/toolkit';

/**
 * Authentication state structure
 * @typedef {Object} AuthState
 * @property {string|null} token - JWT authentication token
 * @property {Object|null} user - User profile information
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Loading state for auth operations
 * @property {string|null} error - Error message for auth operations
 * @property {boolean} requiresPin - Whether PIN verification is required
 */

/** @type {AuthState} */
const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requiresPin: false,
};

/**
 * Auth slice with reducers for managing authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when loading starts
      }
    },

    /**
     * Set authentication error
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear authentication error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set authentication token and mark as authenticated
     */
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      state.requiresPin = false;
    },

    /**
     * Set user profile information
     */
    setUser: (state, action) => {
      state.user = action.payload;
    },

    /**
     * Set PIN requirement state
     */
    setRequiresPin: (state, action) => {
      state.requiresPin = action.payload;
    },

    /**
     * Complete logout process
     */
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.requiresPin = false;
    },

    /**
     * Reset auth state to initial values
     */
    resetAuth: () => initialState,
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  setToken,
  setUser,
  setRequiresPin,
  logout,
  resetAuth,
} = authSlice.actions;

// Export reducer
export const authReducer = authSlice.reducer;

// Export selectors
/**
 * Select authentication token
 * @param {Object} state - Redux state
 * @returns {string|null} Authentication token
 */
export const selectToken = (state) => state.auth.token;

/**
 * Select user profile information
 * @param {Object} state - Redux state
 * @returns {Object|null} User profile
 */
export const selectUser = (state) => state.auth.user;

/**
 * Select authentication status
 * @param {Object} state - Redux state
 * @returns {boolean} Whether user is authenticated
 */
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

/**
 * Select loading state
 * @param {Object} state - Redux state
 * @returns {boolean} Loading state
 */
export const selectIsLoading = (state) => state.auth.isLoading;

/**
 * Select error message
 * @param {Object} state - Redux state
 * @returns {string|null} Error message
 */
export const selectError = (state) => state.auth.error;

/**
 * Select PIN requirement state
 * @param {Object} state - Redux state
 * @returns {boolean} Whether PIN verification is required
 */
export const selectRequiresPin = (state) => state.auth.requiresPin;

/**
 * Select complete auth state
 * @param {Object} state - Redux state
 * @returns {AuthState} Complete authentication state
 */
export const selectAuthState = (state) => state.auth;

export default authSlice;
