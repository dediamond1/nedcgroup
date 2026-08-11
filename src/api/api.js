import { create } from 'apisauce'
import { baseUrl } from '../constants/api'


export const api = create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': "application/json",
        Accept: "application/json"
    }
})

/**
 * Standardize a successful apisauce response.
 * @param {Object} response - apisauce response (ok === true)
 * @returns {{success: boolean, data: *, status: number|undefined}}
 */
export const handleApiSuccess = (response) => ({
    success: true,
    data: response?.data,
    status: response?.status,
});

/**
 * Standardize an apisauce error response.
 * @param {Object} error - apisauce error response or thrown Error
 * @returns {{success: boolean, error: string, data: *, status: number|undefined}}
 */
export const handleApiError = (error) => {
    if (error && error.data) {
        return {
            success: false,
            error: error.data?.message || error.data?.error || 'Request failed',
            data: error.data,
            status: error.status,
        };
    }
    return {
        success: false,
        error: error?.message || 'Network error',
        data: null,
        status: error?.status,
    };
};

export default api;
