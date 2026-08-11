import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

/**
 * Redux store — single source of truth for app state.
 * Auth state lives in src/redux/features/auth/authSlice (RTK).
 */
export const store = configureStore({
  reducer: rootReducer,
});
