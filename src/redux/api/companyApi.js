/**
 * Company domain — company info / status (legacy /api/manager/details).
 * Replaces the direct api.get in useGetCompanyInfo.
 */
import { baseApi } from './baseApi';

export const companyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanyInfo: build.query({
      query: () => '/api/manager/details',
      providesTags: ['Company'],
    }),
  }),
});

export const { useGetCompanyInfoQuery } = companyApi;
