/**
 * API barrel.
 *
 * Resolves the previously-broken directory import `import api from '../api'`
 * used by src/api/services/authService.js (there was no index.js, so the
 * module never resolved and the redux auth path was dead).
 */
export { default } from './api';
export { api, handleApiSuccess, handleApiError } from './api';
