import { createAsyncThunk } from '@reduxjs/toolkit';
import { storeToken, removeToken, getToken } from '../../../helper/storage';
import authService from '../../../api/services/authService';
import {
  setLoading,
  setError,
  clearError,
  setToken,
  setUser,
  setRequiresPin,
  logout as logoutAction,
} from './authSlice';

/**
 * Async thunk for user login
 * Handles email/password authentication and sets appropriate state
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.login(email, password);

      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }

      // STEP-1 login: the backend answers with a "login verified" message and a
      // step-1 token. The app ALWAYS routes login through PIN verification
      // (PINSCREEN) — a login response never completes authentication by itself,
      // so we never setToken here (matches the pre-redux hook behavior).
      const message = (response.data?.message || '').toLowerCase();
      if (message.includes('login verified') || message.includes('provide token')) {
        dispatch(setRequiresPin(true));
        return { requiresPin: true, email, password };
      }

      // Backend sent a token without the PIN-required message — the app still
      // asks for the PIN before authenticating (current hook behavior).
      if (response.data?.token) {
        dispatch(setRequiresPin(true));
        return { requiresPin: true, token: response.data.token, email, password };
      }

      // Soft-error responses (HTTP 200 with a backend error message, no token)
      if (response.data?.message) {
        throw new Error(response.data.message);
      }

      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Login action error:', error);
      dispatch(setError(error.message || 'Login failed'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Async thunk for PIN code verification
 * Completes the authentication process after PIN verification
 */
export const verifyPin = createAsyncThunk(
  'auth/verifyPin',
  async ({ email, password, pinCode }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.verifyPinCode({ email, password, pinCode });

      if (!response.success) {
        throw new Error(response.error || 'PIN verification failed');
      }

      if (response.data?.token) {
        await storeToken(response.data.token);
        dispatch(setToken(response.data.token));

        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }

        dispatch(setRequiresPin(false));
        return response.data;
      }

      // Soft-error responses (HTTP 200 with a backend error message, no token)
      if (response.data?.message) {
        throw new Error(response.data.message);
      }

      throw new Error('Invalid PIN verification response');
    } catch (error) {
      console.error('PIN verification action error:', error);
      dispatch(setError(error.message || 'PIN verification failed'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Passwordless login — step 1: request a login code by email.
 * The backend emails a single-use 6-digit code (10-min expiry).
 */
export const requestLoginCode = createAsyncThunk(
  'auth/requestLoginCode',
  async ({ email }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.requestLoginCode(email);

      if (!response.success) {
        // Surface the backend's message (unknown email, cooldown, send failure).
        throw new Error(response.data?.message || response.error || 'Request code failed');
      }

      if (response.data?.message) {
        return response.data;
      }

      throw new Error('Invalid code request response');
    } catch (error) {
      console.error('Request code action error:', error);
      dispatch(setError(error.message || 'Request code failed'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Passwordless login — step 2: verify the emailed code.
 * On success the final token is persisted and the store is updated, so App.js
 * automatically switches from AuthNavigation to AppSideNavigation (no PIN
 * gate — the code replaced the password).
 */
export const verifyLoginCode = createAsyncThunk(
  'auth/verifyLoginCode',
  async ({ email, code }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.verifyLoginCode({ email, code });

      if (!response.success) {
        // Surface the backend's message (wrong code, expired, too many attempts).
        throw new Error(response.data?.message || response.error || 'Verify code failed');
      }

      if (response.data?.token) {
        await storeToken(response.data.token);
        dispatch(setToken(response.data.token));

        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }

        dispatch(setRequiresPin(false));
        return response.data;
      }

      // Soft-error responses (HTTP 200 with a backend error message, no token)
      if (response.data?.message) {
        throw new Error(response.data.message);
      }

      throw new Error('Invalid code verification response');
    } catch (error) {
      console.error('Verify code action error:', error);
      dispatch(setError(error.message || 'Verify code failed'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Async thunk for checkout PIN confirmation (confirm-pin endpoint)
 * Returns the RAW service response so the caller can switch on the backend
 * messages ('Pin code is Correct', invalid/expired token, credit limit reached).
 * Navigation and alert handling stay in the calling hook/screen.
 */
export const confirmPin = createAsyncThunk(
  'auth/confirmPin',
  async ({ pinCode }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await authService.confirmPinCode(pinCode, headers);

      // Return the raw response — the hook switches on response.data.message
      return response;
    } catch (error) {
      console.error('Confirm PIN action error:', error);
      return rejectWithValue(error.message || 'Confirm PIN failed');
    }
  }
);

/**
 * Async thunk for user logout
 * Clears authentication state and removes stored token
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Call logout API if needed
      await authService.logoutUser();

      // Clear local storage and state
      await removeToken();
      dispatch(logoutAction());

      return { success: true };
    } catch (error) {
      console.error('Logout action error:', error);
      // Even if API call fails, we should clear local state
      await removeToken();
      dispatch(logoutAction());
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Async thunk for token refresh
 * Handles refreshing expired authentication tokens
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await authService.refreshToken();

      if (!response.success) {
        throw new Error(response.error || 'Token refresh failed');
      }

      if (response.data?.token) {
        await storeToken(response.data.token);
        dispatch(setToken(response.data.token));
        return response.data;
      }

      throw new Error('Invalid token refresh response');
    } catch (error) {
      console.error('Token refresh action error:', error);
      dispatch(setError(error.message || 'Token refresh failed'));

      // If token refresh fails, logout the user
      await removeToken();
      dispatch(logoutAction());

      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Async thunk for loading stored token on app start
 * Checks for existing authentication token in storage
 */
export const loadStoredToken = createAsyncThunk(
  'auth/loadStoredToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = await getToken();

      if (token) {
        const parsedToken = JSON.parse(token);
        dispatch(setToken(parsedToken));

        // Optionally load user profile here
        // await dispatch(loadUserProfile());

        return { token: parsedToken };
      }

      return { token: null };
    } catch (error) {
      console.error('Load stored token error:', error);
      // Clear invalid token from storage
      await removeToken();
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for loading user profile
 * Fetches complete user profile information
 */
export const loadUserProfile = createAsyncThunk(
  'auth/loadUserProfile',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState();

      if (!state.auth.token) {
        throw new Error('No authentication token available');
      }

      dispatch(setLoading(true));

      const response = await authService.getProfile();

      if (!response.success) {
        throw new Error(response.error || 'Failed to load user profile');
      }

      if (response.data) {
        dispatch(setUser(response.data));
        return response.data;
      }

      throw new Error('Invalid profile response');
    } catch (error) {
      console.error('Load user profile error:', error);
      dispatch(setError(error.message || 'Failed to load profile'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Clear any authentication errors
 */
export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

export default {
  login,
  verifyPin,
  confirmPin,
  logout,
  refreshToken,
  loadStoredToken,
  loadUserProfile,
  clearAuthError,
};
