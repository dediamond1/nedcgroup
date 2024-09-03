import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

export const generatePDF = async (orderHistory) => {
    // Group products by voucher description
    const groupedProducts = orderHistory.reduce((accumulator, product) => {
        const { voucherDescription, voucherAmount } = product;
        if (!accumulator[voucherDescription]) {
            accumulator[voucherDescription] = {
                voucherDescription,
                voucherAmount,
                quantity: 0,
                total: 0,
            };
        }
        accumulator[voucherDescription].quantity++;
        accumulator[voucherDescription].total += voucherAmount * accumulator[voucherDescription].quantity;
        return accumulator;
    }, {});

    // Generate product rows HTML
    const productRowsHTML = Object.values(groupedProducts).map((group) => `
    <tr>
        <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${group.voucherDescription}</td>
        <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${group.quantity}</td>
        <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${group.voucherAmount} kr</td>
        <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${group.total}</td>
    </tr>
    `).join('');

    // Complete HTML template with product rows
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    </head>
    <body>
      <div style="margin: 20px auto; font-family: Poppins; width: 600px; background-color: #f5f5f5; padding: 20px; border: 1px solid #e0e0e0; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; color: #333; margin: 0;">SÅLD ORDERHISTORIK</h1>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="margin-top: 30px;"></div>
          <div>
            <span style="font-weight: bold;">Date:</span>
            <span>May 22, 2023</span>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; background-color: #f1f1f1; border-bottom: 2px solid #ddd;">Description</th>
              <th style="padding: 10px; text-align: left; background-color: #f1f1f1; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: left; background-color: #f1f1f1; border-bottom: 2px solid #ddd;">Unit Price</th>
              <th style="padding: 10px; text-align: left; background-color: #f1f1f1; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
          ${productRowsHTML}
          </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
          <div style="text-align: right;">
            <p style="font-weight: bold;">Subtotal: $290.00</p>
            <p style="font-weight: bold;">Tax (10%): $29.00</p>
            <p style="font-weight: bold;">Total: $319.00</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px;">Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
        // Generate PDF using react-native-html-to-pdf
        const options = {
            html: htmlTemplate,
            fileName: 'order_history',
            directory: RNFS.ExternalDirectoryPath,  // Use external directory path
        };

        const file = await RNHTMLtoPDF.convert(options);
        console.log('Generated PDF file path:', file.filePath);

        // Ensure file exists and is accessible
        const fileExists = await RNFS.exists(file.filePath);
        if (!fileExists) {
            throw new Error('File does not exist');
        }

        return { uri: `file://${file.filePath}` };  // Ensure the URI is correctly formatted
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
