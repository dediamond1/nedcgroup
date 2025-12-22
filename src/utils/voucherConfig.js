import { api } from '../api/api';

/**
 * Fetches voucher configuration from the API
 * @returns {Promise<Object>} Operator configuration object
 */
export const fetchVoucherConfig = async () => {
  try {
    const response = await api.get('/api/voucher-config');
    if (response.ok && response.data?.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch voucher config');
  } catch (error) {
    console.error('Error fetching voucher config:', error);
    // Return fallback config if API fails
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

