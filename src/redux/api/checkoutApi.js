/**
 * Checkout domain — the operator purchase engine: fetch voucher + create order.
 * Used by OperatorCheckout (telia/halebop/lyca) through the shared config.
 */
import { baseApi } from './baseApi';

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    teliaVouchers: build.mutation({
      query: ({ id, value }) => ({
        url: '/api/telia/vouchers',
        method: 'POST',
        body: { id, value },
      }),
    }),
    lycaReserve: build.query({
      query: (articleId) => `/api/lycamobile/categories/${articleId}/products`,
    }),
    teliaOrderCreate: build.mutation({
      query: (order) => ({
        url: '/api/teliaOrder/create',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    lycaOrderCreate: build.mutation({
      query: (order) => ({
        url: '/api/lyca-order',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useTeliaVouchersMutation,
  useLycaReserveQuery,
  useLazyLycaReserveQuery,
  useTeliaOrderCreateMutation,
  useLycaOrderCreateMutation,
} = checkoutApi;
