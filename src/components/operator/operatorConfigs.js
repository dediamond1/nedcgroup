/**
 * Per-operator configuration for the shared operator voucher flow.
 *
 * The telia / halebop / lyca flows are ~95% identical:
 *   category list -> product list -> PIN confirm -> order create -> voucher print
 *
 * All behavioural differences between operators live here. The shared
 * components (OperatorCategoryList / OperatorCheckout / OperatorPrintScreen)
 * are driven entirely by these configs.
 *
 * Colors:
 *  - Telia   #990AE3 (Telia-h-CategoryScreen.js)
 *  - Halebop #3b3687 (Telia-h-CategoryScreen.js line 89)
 *  - Lyca    #e2027b (Lyca's own brand pink — src/constants/colors.js
 *                     primary.main, also used for Lyca icons/loaders)
 */
import { format } from 'date-fns';
import { api } from '../../api/api';
import { logo as lycaLogo } from '../../screens/lyca/logo';
import { teliaLogo, halebopLogo } from '../../screens/telia-halebop/teliaHalebopLogos';

/** Shared across every operator — do not change (auth flow semantics). */
export const CONFIRM_PIN_ROUTE = '/api/auth/confirm-pin';

const LYCA_CATEGORIES_ROUTE = '/api/lycamobile/categories/';

const lycaCheckout = {
  layout: 'receipt',
  headerTitle: (subcategory) => `${subcategory?.name} kr`,
  headerTextStyle: { fontSize: 16, textTransform: 'uppercase' },
  authTokenSource: 'userToken', // order-create header uses the storage token (historical lyca behaviour)
  printMode: 'inline', // print inline in the checkout screen, then show the voucher modal
  loadVoucherConfig: true,
  initBluetooth: true,
  bluetooth: {
    autoPair: true,
    readyStatusText: '',
    errorStatusText: null,
  },
  // Fetch the voucher for the selected product (GET for lyca).
  fetchVoucher: async (subcategory) => {
    const { data } = await api.get(
      `/api/lycamobile/categories/${subcategory.articleId}/products`,
    );
    if (
      data?.error === `No vouchers available for category ${subcategory?.articleId}.`
    ) {
      return {
        ok: false,
        closeOtp: true,
        statusText: 'Produkten är slutsåld eller något fick fel',
        alertTitle: 'OBS',
        alert: 'Produkten är slutsåld eller något fick fel kontakta support +467****4031',
      };
    }
    if (!data?.products?.[0]?.voucherNumber) {
      return {
        ok: false,
        closeOtp: true,
        statusText: 'Produkten är slutsåld eller något fick fel kontakta support +467****4031',
        alertTitle: 'OBS',
        alert: 'Produkten är slutsåld eller något fick fel',
      };
    }
    return { ok: true, voucher: data.products[0] };
  },
  orderCreate: {
    route: '/api/lyca-order',
    body: (subcategory, voucher) => ({
      serialNumber: voucher.serialNumber,
      voucherNumber: voucher.voucherNumber,
      voucherDescription: subcategory?.name,
      articleId: subcategory?.articleId,
      voucherAmount: subcategory?.price,
      voucherCurrency: 'SEK',
      employeeId: null,
    }),
  },
  // Historical message strings (note the "deativted" typo is the actual API message).
  deactivationMessage: 'Company deativted because you have reached Credit Limit',
  invalidTimeMessage: 'not valid time to book order.',
  invalidTimeAlert: 'Inte giltig tid att boka order',
  invalidTokenAlert: {
    title: 'OBS...',
    message: 'DU HAR BLIVIT UTLOGGAD',
    withRelogin: false,
  },
};

const teliaHalebopCheckout = (key, label) => ({
  layout: 'features',
  headerTitle: (product) => product?.id,
  headerTextStyle: null,
  authTokenSource: 'user', // order-create header uses the context token (historical telia behaviour)
  printMode: 'navigate', // order success navigates to the standalone print screen
  printRoute: 'TeliaHalebopPrintScreen',
  buildPrintParams: (voucherInfo, product, companyInfo) => ({
    voucherInfo,
    product,
    companyInfo,
  }),
  loadVoucherConfig: false, // the print screen owns voucher-config loading for telia/halebop
  initBluetooth: false, // bluetooth is initialised on the print screen
  fetchVoucher: async (product, authToken) => {
    const voucherResponse = await api.post(
      '/api/telia/vouchers',
      { id: product.id, value: product.price },
      { headers: { Authorization: `Bearer ${authToken}` } },
    );
    if (!voucherResponse?.data?.success) {
      return {
        ok: false,
        closeOtp: false,
        statusText: null,
        alertTitle: 'Fel',
        alert: voucherResponse?.data?.message || 'Kunde inte hämta voucher.',
      };
    }
    return { ok: true, voucher: voucherResponse.data };
  },
  orderCreate: {
    route: '/api/teliaOrder/create',
    body: (product, voucherInfo) => ({
      serialNumber: voucherInfo.serialNumber,
      voucherNumber: voucherInfo.voucherNumber,
      voucherDescription: product.name,
      articleId: product.articleId,
      voucherAmount: product.price,
      voucherCurrency: 'SEK',
      prebookId: voucherInfo.prebookId,
      expireDate: null,
      employeeId: null,
      operator: product?.operator,
    }),
  },
  deactivationMessage: 'Company deactivated because you have reached Credit Limit',
  invalidTimeMessage: null,
  invalidTimeAlert: null,
  invalidTokenAlert: {
    title: 'OBS',
    message: 'Du har blivit utloggad, vänligen logga in igen',
    withRelogin: true,
  },
});

const teliaHalebopCategoryList = (key, label, productsRoute) => ({
  presentation: 'bottomSheet',
  rowStyle: 'telia',
  endpoint: productsRoute,
  authTokenSource: 'user',
  parseCategories: (data) => data || [],
  fetchProducts: null, // products are delivered with the category list
  detailRoute: 'TELIA_DETAIL',
  detailParams: (item) => ({
    product: {
      id: item.id,
      name: item.id,
      price: item.value,
      description: item.description,
      articleId: item?.articleId,
      operator: key === 'telia' ? 'Telia' : 'Halebop',
    },
  }),
  headerTitle: label,
  emptyText: 'Något gick fel, vänligen kontakta support',
  phoneText: '+467****4031',
  fullScreenLoading: true,
});

const teliaHalebopPrint = (key) => ({
  logo: key === 'telia' ? teliaLogo : halebopLogo,
  logoOptions: { width: 300, left: 45 },
  titleOptions: {},
  label: 'kod',
  sections: [
    'title',
    'description',
    'label',
    'voucherNumber',
    'rechargeText',
    'qr',
    'scanText',
    'validity',
    'support',
    'serialNumber',
    'balanceCheck',
    'companyInfo',
    'dateTime',
  ],
  description: (product) => product?.description,
  validityText: (expireDate) =>
    `\r\nkoden ar giltig: ${format(new Date(expireDate), 'yyyy-MM-dd')}`,
  extraLines: () => [],
  dateLines: (currentTime, currentDate) => [currentTime, ` ${currentDate}`],
  voucherConfigOperator: key === 'telia' ? 'TELIA' : 'HALEBOP',
  voucherConfigFallback: 'TELIA',
});

const lycaPrint = {
  logo: lycaLogo,
  logoOptions: { width: 350, left: 10 },
  titleOptions: { fonttype: 1 },
  label: 'Vardebevis',
  sections: [
    'title',
    'label',
    'voucherNumber',
    'description',
    'rechargeText',
    'validity',
    'support',
    'serialNumber',
    'qr',
    'scanText',
    'extraLines',
    'companyInfo',
    'dateTime',
  ],
  description: (subcategory) => subcategory?.InfoPos,
  validityText: () => 'koden ar giltig: 12 manader',
  extraLines: () => ['registrera sim-kort pa online    genom att skanna  '],
  dateLines: () => [
    ` ${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}`,
  ],
  voucherConfigOperator: 'LYCA',
  voucherConfigFallback: null,
};

export const OPERATOR_CONFIGS = {
  lyca: {
    key: 'lyca',
    label: 'Lyca mobile',
    operatorCode: 'LYCA',
    colors: {
      primary: '#e2027b', // Lyca's own brand pink
      secondary: '#3b3687', // legacy contrast colour used in the lyca screens
    },
    homeRoute: 'INTRO',
    categoryList: {
      presentation: 'modal',
      rowStyle: 'lyca',
      endpoint: LYCA_CATEGORIES_ROUTE,
      authTokenSource: null,
      parseCategories: (data) => Object.keys(data?.categories),
      fetchProducts: async (categoryName) => {
        const { data } = await api.get(LYCA_CATEGORIES_ROUTE);
        return data?.categories?.[categoryName] || [];
      },
      detailRoute: 'LYCADETAILS',
      detailParams: (item, categoryName) => ({ subcategory: item, categoryName }),
      headerTitle: 'Lyca mobile',
      headerTextStyle: { fontSize: 24, color: '#fff' },
      emptyText: 'Inga kategorier tillgängliga. Kontakta support: +467****4031',
      noProductsText: 'Inga produkter hittades. Kontakta support: +467****4031',
      errorText: 'Något gick fel. Kontakta support: +467****4031',
      fullScreenLoading: false,
    },
    checkout: lycaCheckout,
    print: lycaPrint,
  },

  telia: {
    key: 'telia',
    label: 'Telia Products',
    operatorCode: 'TELIA',
    colors: {
      primary: '#990AE3',
      secondary: '#990AE3',
    },
    homeRoute: 'INTRO',
    categoryList: teliaHalebopCategoryList('telia', 'Telia Products', '/api/telia/products/local/telia'),
    checkout: teliaHalebopCheckout('telia', 'Telia Products'),
    print: teliaHalebopPrint('telia'),
  },

  halebop: {
    key: 'halebop',
    label: 'Halebop Products',
    operatorCode: 'HALEBOP',
    colors: {
      primary: '#3b3687',
      secondary: '#3b3687',
    },
    homeRoute: 'INTRO',
    categoryList: teliaHalebopCategoryList('halebop', 'Halebop Products', '/api/telia/products/local/halebop'),
    checkout: teliaHalebopCheckout('halebop', 'Halebop Products'),
    print: teliaHalebopPrint('halebop'),
  },
};

/**
 * Resolve the operator config from the redux auth slice value used by the
 * telia/halebop flow ('Telia' | 'Halebop'). Anything else falls back to telia.
 */
export const getOperatorConfig = (teliaHalebop) => {
  if (teliaHalebop === 'Halebop') return OPERATOR_CONFIGS.halebop;
  if (teliaHalebop === 'Telia') return OPERATOR_CONFIGS.telia;
  return OPERATOR_CONFIGS.telia;
};
