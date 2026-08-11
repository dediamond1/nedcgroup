/**
 * RTK Query base API — the single data-fetching layer.
 * All API calls flow through here; components/screens never call fetch/axios
 * directly. The auth token is injected from the store automatically.
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../constants/api';
import { selectToken } from '../features/auth/authSlice';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Company', 'Orders', 'Catalog'],
  endpoints: () => ({}),
});
