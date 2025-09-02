/**
 * Centralized API route constants
 * All API endpoints should be defined here for maintainability
 */

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/api/manager/login',
  PIN_CHECK: '/api/manager/pinCheck',
  LOGOUT: '/api/manager/logout',
  REFRESH_TOKEN: '/api/manager/refresh',
  PROFILE: '/api/manager/profile',
};

// User management routes
export const USER_ROUTES = {
  GET_USERS: '/api/manager/users',
  UPDATE_USER: '/api/manager/user',
  DELETE_USER: '/api/manager/user',
};

// Booking and order routes
export const BOOKING_ROUTES = {
  GET_ORDERS: '/api/orders',
  CREATE_ORDER: '/api/order',
  UPDATE_ORDER: '/api/order',
  DELETE_ORDER: '/api/order',
  ORDER_DETAILS: '/api/order/details',
};

// Product and inventory routes
export const PRODUCT_ROUTES = {
  GET_PRODUCTS: '/api/products',
  GET_PRODUCT_DETAILS: '/api/product',
  UPDATE_PRODUCT: '/api/product',
};

// Company and settings routes
export const COMPANY_ROUTES = {
  GET_INFO: '/api/company/info',
  UPDATE_SETTINGS: '/api/company/settings',
  GET_ANNOUNCEMENTS: '/api/announcement',
};

// System and utility routes
export const SYSTEM_ROUTES = {
  LATEST_VERSION: '/api/latest-version',
  HEALTH_CHECK: '/api/health',
  UPLOAD_FILE: '/api/upload',
};

// Telia/Halebop specific routes
export const TELIA_ROUTES = {
  GET_TELIA_PRODUCTS: '/api/telia/products',
  CREATE_TELIA_ORDER: '/api/telia/order',
  TELIA_ORDER_STATUS: '/api/telia/order/status',
};

// Lyca Mobile specific routes
export const LYCA_ROUTES = {
  GET_LYCA_PRODUCTS: '/api/lyca/products',
  CREATE_LYCA_ORDER: '/api/lyca/order',
  LYCA_ORDER_STATUS: '/api/lyca/order/status',
};

// Quick support routes
export const SUPPORT_ROUTES = {
  QUICK_SUPPORT: '/api/support/quick',
  CONTACT_SUPPORT: '/api/support/contact',
  SUPPORT_TICKETS: '/api/support/tickets',
};

export default {
  AUTH_ROUTES,
  USER_ROUTES,
  BOOKING_ROUTES,
  PRODUCT_ROUTES,
  COMPANY_ROUTES,
  SYSTEM_ROUTES,
  TELIA_ROUTES,
  LYCA_ROUTES,
  SUPPORT_ROUTES,
};
