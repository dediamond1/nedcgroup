import { api } from '../api/api';

/**
 * Fetches voucher configuration from the API
 * @returns {Promise<Object>} Operator configuration object
 */
export const fetchVoucherConfig = async () => {
  try {
    const response = await api.get('/api/voucher-config');
    
    // Log response for debugging
    console.log('Voucher config API response:', {
      ok: response.ok,
      status: response.status,
      hasData: !!response.data,
      dataStructure: response.data ? Object.keys(response.data) : null
    });
    
    // Check multiple conditions - be more lenient with response structure
    if (response.status === 200) {
      // If response has success flag and data
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      // If response.data is directly the config object (fallback structure)
      if (response.data && typeof response.data === 'object' && response.data.COMVIQ) {
        return response.data;
      }
    }
    
    // If response exists but structure is wrong, log and use fallback
    console.warn('Voucher config API response format unexpected, using fallback:', {
      status: response.status,
      ok: response.ok,
      data: response.data
    });
    return getFallbackConfig();
  } catch (error) {
    console.error('Error fetching voucher config:', error);
    // Always return fallback config if API fails
    return getFallbackConfig();
  }
};

/**
 * Formats a template string by replacing {voucherNumber} with actual voucher number
 * @param {string} template - Template string with {voucherNumber} placeholder
 * @param {string} voucherNumber - Actual voucher number to replace
 * @returns {string} Formatted string
 */
const formatTemplate = (template, voucherNumber) => {
  if (!template) return null;
  return template.replace(/{voucherNumber}/g, voucherNumber);
};

/**
 * Formats operator config templates with voucher number
 * @param {Object} config - Raw config from API
 * @param {string} voucherNumber - Voucher number to format
 * @returns {Object} Formatted config with rechargeText and qrCode as strings
 */
export const formatOperatorConfig = (config, voucherNumber) => {
  if (!config) return null;
  
  return {
    rechargeText: formatTemplate(config.rechargeText, voucherNumber),
    qrCode: formatTemplate(config.qrCode, voucherNumber),
    support: config.support,
    balanceCheck: config.balanceCheck,
  };
};

/**
 * Gets operator config with formatted values
 * @param {Object} operatorConfig - Full operator config object from API
 * @param {string} operator - Operator name (COMVIQ, LYCA, TELIA, HALEBOP)
 * @param {string} voucherNumber - Voucher number to format
 * @returns {Object} Formatted config for the operator
 */
export const getOperatorConfig = (operatorConfig, operator, voucherNumber) => {
  const config = operatorConfig[operator] || operatorConfig['COMVIQ'];
  return formatOperatorConfig(config, voucherNumber);
};

/**
 * Fallback configuration in case API fails
 * @returns {Object} Fallback operator config
 */
const getFallbackConfig = () => {
  return {
    COMVIQ: {
      rechargeText: `Tanka ditt kontantkort genom att trycka *110*{voucherNumber}# och lur eller skanna QR-koden ovan`,
      qrCode: `*110*{voucherNumber}#`,
      support: `För frågor och villkor kontakta COMVIQs kundtjänst på 212 eller 0772-21 21 21`,
      balanceCheck: `Kontrollera ditt saldo genom att trycka *111# och lur`,
    },
    LYCA: {
      rechargeText: `Tanka registrerat kontantkort genom att ringa *101*{voucherNumber}#`,
      qrCode: `*101*{voucherNumber}#`,
      support: `Vid hjälp kontakta vår kundtjänst på telefon 3322 eller besök vår webbplats www.lycamobile.se`,
      balanceCheck: null,
    },
    TELIA: {
      rechargeText: `Ladda ditt kontantkort genom att trycka *125*{voucherNumber}# lur/skicka på din mobil.`,
      qrCode: `*125*{voucherNumber}#`,
      support: `Har du Telia? Då kan du även ladda på telia.se/laddningscheck\nVid problem, kontakta kundtjänst på tel. 90 200.`,
      balanceCheck: null,
    },
    HALEBOP: {
      rechargeText: `Ladda ditt kontantkort genom att trycka *125*{voucherNumber}# lur/skicka på din mobil.`,
      qrCode: `*125*{voucherNumber}#`,
      support: `Har du Halebop? Vid problem, kontakta support dygnet runt på halebop.se/support.`,
      balanceCheck: null,
    },
  };
};

