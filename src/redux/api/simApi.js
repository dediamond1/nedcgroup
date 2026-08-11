/**
 * SIM registration domain — BankID + physical ID + SMS challenge flows
 * (legacy controllers/simRegistration.js, ported to /api/simregistration/*).
 */
import { baseApi } from './baseApi';

export const simApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    authenticate: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/authenticate', method: 'POST', body: payload }),
    }),
    collect: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/collect', method: 'POST', body: payload }),
    }),
    bankid: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/bankid', method: 'POST', body: payload }),
    }),
    physicalid: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/physicalid', method: 'POST', body: payload }),
    }),
    smschallenge: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/smschallenge', method: 'POST', body: payload }),
    }),
    bankidTwoFactor: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/bankid/twofactor', method: 'POST', body: payload }),
    }),
    physicalidTwoFactor: build.mutation({
      query: (payload) => ({ url: '/api/simregistration/physicalid/twofactor', method: 'POST', body: payload }),
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useCollectMutation,
  useBankidMutation,
  usePhysicalidMutation,
  useSmschallengeMutation,
  useBankidTwoFactorMutation,
  usePhysicalidTwoFactorMutation,
} = simApi;
