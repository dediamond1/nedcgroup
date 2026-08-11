/**
 * Support + system domain — password reset, announcements.
 */
import { baseApi } from './baseApi';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    resetPassword: build.mutation({
      query: (email) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: { email },
      }),
    }),
    announcements: build.query({
      query: () => '/api/announcements',
    }),
    latestVersion: build.query({
      query: () => '/api/latest-version',
    }),
  }),
});

export const { useResetPasswordMutation, useAnnouncementsQuery, useLatestVersionQuery } = supportApi;
