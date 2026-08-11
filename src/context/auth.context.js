import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectToken,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectRequiresPin,
  selectInActive,
  setToken,
  setUser as setUserProfile,
  setInActive as setInActiveAction,
  logout,
} from '../redux/features/auth/authSlice';

/**
 * AuthContext — kept for backwards compatibility so the existing screens
 * (`useContext(AuthContext)`) barely change.
 *
 * IMPORTANT: the context is now ONLY a bridge. All auth state (token, user,
 * isAuthenticated, isLoading, error, requiresPin, inActive) is owned by the
 * RTK authSlice (src/redux/features/auth/authSlice.js). The Provider in App.js
 * reads from the store via selectors and exposes dispatch wrappers.
 */
export const AuthContext = React.createContext();

/**
 * Thin selector/dispatch bridge over the RTK authSlice.
 * Same surface as the AuthContext value, for hooks/components that prefer a
 * hook over context.
 *
 * NOTE: `user` is the JWT token string — historical app behavior (the token is
 * used as the bearer token in request headers and as the auth gate in App.js).
 */
export const useAuth = () => {
  const user = useSelector(selectToken);
  const profile = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const requiresPin = useSelector(selectRequiresPin);
  const inActive = useSelector(selectInActive);
  const dispatch = useDispatch();

  /**
   * setUser accepts:
   *  - null/undefined  -> logout (clears token + auth state)
   *  - token string    -> setToken (marks authenticated)
   *  - user object     -> stores the profile (setUser action)
   */
  const setUser = (payload) => {
    if (payload == null) {
      dispatch(logout());
    } else if (typeof payload === 'string') {
      dispatch(setToken(payload));
    } else {
      dispatch(setUserProfile(payload));
    }
  };

  const setInActive = (value) => dispatch(setInActiveAction(value));

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    requiresPin,
    inActive,
    setUser,
    setInActive,
  };
};
