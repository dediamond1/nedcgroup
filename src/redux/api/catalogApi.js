/**
 * Catalog domain — operator product catalogues + voucher config + articles.
 * These catalogue endpoints are unauthenticated (the RN sends no token).
 */
import { baseApi } from './baseApi';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    comviqData: build.query({
      query: () => '/api/comviq-data',
    }),
    lycaCategories: build.query({
      query: () => '/api/lycamobile/categories/',
    }),
    teliaProducts: build.query({
      query: () => '/api/telia/products',
    }),
    voucherConfig: build.query({
      query: () => '/api/voucher-config',
    }),
    article: build.query({
      query: (id) => `/api/category/artical/${id}`,
    }),
  }),
});

export const {
  useComviqDataQuery,
  useLycaCategoriesQuery,
  useTeliaProductsQuery,
  useVoucherConfigQuery,
  useArticleQuery,
} = catalogApi;
