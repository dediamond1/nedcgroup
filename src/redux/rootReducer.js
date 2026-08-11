import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './features/auth/authSlice';
import { baseApi } from './api/baseApi';

/**
 * Root reducer that combines all feature reducers
 * This is the single source of truth for the application state
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  // Add other feature reducers here as the app grows
});

/**
 * Root state type for better state access in components
 * This provides TypeScript-like intellisense in JavaScript
 */
export const RootState = store => store;

/**
 * App dispatch type for better dispatch action intellisense
 */
export const AppDispatch = store => store.dispatch;
