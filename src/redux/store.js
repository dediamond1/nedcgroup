import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { authSlice } from './auth/auth.reducer';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: [...getDefaultMiddleware()],
});
