/**
 * Orders domain — list/create/delete orders for all operators.
 * The RN history screen fetches per operator; the checkout creates comviq
 * orders via POST /api/order (legacy QrCodeScreen flow).
 */
import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listOrders: build.query({
      query: () => '/api/order',
      providesTags: ['Orders'],
    }),
    listLycaOrders: build.query({
      query: () => '/api/lyca-order',
      providesTags: ['Orders'],
    }),
    listTeliaOrders: build.query({
      query: (operator) => ({
        url: '/api/teliaOrder',
        method: 'POST',
        body: { operator },
      }),
      providesTags: ['Orders'],
    }),
    createComviqOrder: build.mutation({
      query: (order) => ({
        url: '/api/order',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: build.mutation({
      query: (orderId) => ({
        url: '/api/order',
        method: 'DELETE',
        body: { orderId },
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteTeliaOrder: build.mutation({
      query: (orderId) => ({
        url: '/api/teliaOrder',
        method: 'DELETE',
        body: { orderId },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useListOrdersQuery,
  useListLycaOrdersQuery,
  useListTeliaOrdersQuery,
  useCreateComviqOrderMutation,
  useDeleteOrderMutation,
  useDeleteTeliaOrderMutation,
} = ordersApi;
