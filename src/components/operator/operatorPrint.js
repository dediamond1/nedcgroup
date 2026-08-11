/**
 * Shared Bluetooth voucher printing for all operators.
 *
 * The lyca flow prints inline (right after the order is saved) and the
 * telia/halebop flow prints on a standalone screen — but the printer sequence
 * is identical, driven by the per-operator `print` config (sections array).
 *
 * Section keys: title, label, voucherNumber, description, rechargeText,
 * validity, support, serialNumber, qr, scanText, balanceCheck, extraLines,
 * companyInfo, dateTime.
 */
import { Alert } from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import deviceManager from 'react-native-device-info';
import { format } from 'date-fns';
import { getBluetooth, saveBluetooth } from '../../helper/storage';
import { getOperatorConfig } from '../../utils/voucherConfig';

/**
 * Initialise + connect the saved printer. Returns { boundAddress, name } or
 * null on emulator/failure (callers keep their own status/alert handling).
 */
export const initBluetoothPrinter = async ({ onStatus = () => {} } = {}) => {
  const isEmulator = await deviceManager.isEmulator();
  if (isEmulator) {
    Alert.alert('FEL', 'Detta är INTE en riktig enhet!');
    return null;
  }

  onStatus('Initierar Bluetooth...');
  const enabled = await BluetoothManager.checkBluetoothEnabled();
  if (!enabled) {
    await BluetoothManager.enableBluetooth();
  }

  const blStorage = await getBluetooth();
  const savedDevices = blStorage ? JSON.parse(blStorage) : [];

  if (savedDevices && savedDevices.length > 0) {
    const device = savedDevices[0];
    await BluetoothManager.connect(device.address);
    return { boundAddress: device.address, name: device.name || 'OKÄND' };
  }

  const pairedDevices = await BluetoothManager.enableBluetooth();
  if (pairedDevices && pairedDevices.length > 0) {
    const paired = pairedDevices.map((d) => JSON.parse(d));
    await saveBluetooth(paired);
    const device = paired[0];
    await BluetoothManager.connect(device.address);
    return { boundAddress: device.address, name: device.name || 'OKÄND' };
  }

  onStatus('');
  return null;
};

/**
 * Print a voucher receipt. `config` is the operator's `print` config
 * (src/components/operator/operatorConfigs.js), `item` the product/subcategory,
 * `voucherInfo` { voucherNumber, serialNumber, expireDate }, `companyInfo` the
 * manager/company object, `voucherConfigData` the fetched /api/voucher-config
 * payload. Throws on failure so callers can alert.
 */
export const printVoucher = async ({
  config,
  item,
  voucherInfo,
  companyInfo,
  voucherConfigData,
  boundAddress,
  onStatus = () => {},
}) => {
  const isEmulator = await deviceManager.isEmulator();
  if (isEmulator) {
    Alert.alert('FEL', 'Detta ar INTE en riktig enhet!');
    return;
  }

  const voucherNumber = voucherInfo?.voucherNumber || '';
  const serialNumber = voucherInfo?.serialNumber || '';
  const expireDate = voucherInfo?.expireDate || new Date();
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  const currentDate = format(now, 'yyyy-MM-dd');

  const voucherCfg =
    getOperatorConfig(voucherConfigData, config.voucherConfigOperator, voucherNumber) ||
    (config.voucherConfigFallback
      ? getOperatorConfig(voucherConfigData, config.voucherConfigFallback, voucherNumber)
      : null);

  await BluetoothManager.connect(boundAddress);
  await BluetoothEscposPrinter.printerInit();
  await BluetoothEscposPrinter.printerLeftSpace(0);
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

  if (config.logo) {
    await BluetoothEscposPrinter.printPic(config.logo, config.logoOptions || {});
  }

  const sections = config.sections || [];
  for (const section of sections) {
    switch (section) {
      case 'title':
        await BluetoothEscposPrinter.printText(`${config.title(item) ?? ''}`, config.titleOptions || {});
        break;
      case 'label':
        await BluetoothEscposPrinter.printText(config.label, { widthtimes: 1 });
        break;
      case 'voucherNumber':
        await BluetoothEscposPrinter.printText(`${voucherNumber}`, { widthtimes: 1, fonttype: 1 });
        break;
      case 'description':
        await BluetoothEscposPrinter.printText(`${config.description(item) ?? ''}`, {});
        break;
      case 'rechargeText':
        if (voucherCfg?.rechargeText) {
          await BluetoothEscposPrinter.printText(voucherCfg.rechargeText, { fonttype: 1 });
        }
        break;
      case 'validity':
        await BluetoothEscposPrinter.printText(config.validityText(expireDate, voucherCfg), {});
        break;
      case 'support':
        if (voucherCfg?.support) {
          await BluetoothEscposPrinter.printText(voucherCfg.support, { fonttype: 1 });
        }
        break;
      case 'serialNumber':
        await BluetoothEscposPrinter.printText(`Serienummer: ${serialNumber}`, {});
        break;
      case 'qr':
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        if (voucherCfg?.qrCode) {
          await BluetoothEscposPrinter.printQRCode(
            voucherCfg.qrCode,
            170,
            BluetoothEscposPrinter.ERROR_CORRECTION.L
          );
        }
        break;
      case 'scanText':
        await BluetoothEscposPrinter.printText('skanna for att tanka', { fonttype: 1 });
        break;
      case 'balanceCheck':
        if (voucherCfg?.balanceCheck) {
          await BluetoothEscposPrinter.printText(voucherCfg.balanceCheck, { fonttype: 1 });
        }
        break;
      case 'extraLines':
        for (const line of config.extraLines(item, voucherCfg) || []) {
          await BluetoothEscposPrinter.printText(line, { fonttype: 1 });
        }
        break;
      case 'companyInfo':
        if (companyInfo?.manager?.name) {
          await BluetoothEscposPrinter.printText(` ${companyInfo.manager.name.toUpperCase()}`, {});
        }
        if (companyInfo?.manager?.orgNumber) {
          const org = companyInfo.manager.orgNumber.toString();
          await BluetoothEscposPrinter.printText(
            `${org.length > 6 ? org.slice(0, 6) + '-' + 'XXXX' : org}`,
            {}
          );
        }
        break;
      case 'dateTime':
        await BluetoothEscposPrinter.printText('Kopt datum och tid:', {});
        for (const line of config.dateLines(currentTime, currentDate) || []) {
          await BluetoothEscposPrinter.printText(line, {});
        }
        break;
      default:
        break;
    }
    await BluetoothEscposPrinter.printText('\r\n', {});
  }

  await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
  onStatus('Voucher utskriven!');
};
