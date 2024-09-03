import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  pinPage: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.user = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPin: (state, action) => {
      state.pinPage = action.payload;
    },
  },
});

export const pinCodePage = authSlice.actions.setPin;
