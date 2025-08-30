export const operatorConfig = {
  COMVIQ: {
    rechargeText: (voucherNumber) =>
      `Tanka ditt kontantkort genom att trycka *110*${voucherNumber}# och lur eller skanna QR-koden ovan`,
    qrCode: (voucherNumber) => `*110*${voucherNumber}#`,
    support: `För frågor och villkor kontakta COMVIQs kundtjänst på 212 eller 0772-21 21 21`,
    balanceCheck: `Kontrollera ditt saldo genom att trycka *111# och lur`,
  },
  LYCA: {
    rechargeText: (voucherNumber) =>
      `Tanka registrerat kontantkort genom att ringa *101*${voucherNumber}#`,
    qrCode: (voucherNumber) => `*101*${voucherNumber}#`,
    support: `Vid hjälp kontakta vår kundtjänst på telefon 3322 eller besök vår webbplats www.lycamobile.se`,
    balanceCheck: null,
  },
  TELIA: {
    rechargeText: (voucherNumber) =>
      `Ladda ditt kontantkort genom att trycka *125*${voucherNumber}# lur/skicka på din mobil.`,
    qrCode: (voucherNumber) => `*125*${voucherNumber}#`,
    support: `Har du Telia? Då kan du även ladda på telia.se/laddningscheck\nVid problem, kontakta kundtjänst på tel. 90 200.`,
    balanceCheck: null,
  },
  HALEBOP: {
    rechargeText: (voucherNumber) =>
      `Ladda ditt kontantkort genom att trycka *125*${voucherNumber}# lur/skicka på din mobil.`,
    qrCode: (voucherNumber) => `*125*${voucherNumber}#`,
    support: `Har du Halebop? Vid problem, kontakta support dygnet runt på halebop.se/support.`,
    balanceCheck: null,
  },
};




