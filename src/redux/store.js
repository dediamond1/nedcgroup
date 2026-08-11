import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { baseApi } from './api/baseApi';

/**
 * Redux store — single source of truth for app state.
 * Auth state lives in src/redux/features/auth/authSlice (RTK) and all
 * server data flows through the RTK Query APIs (src/redux/api/*).
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
