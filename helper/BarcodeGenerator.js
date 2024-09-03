import axios from 'axios';

export const generateBarcodeBase64 = async (ean) => {
    try {
        // Make a POST request to Barcodes4.me API
        const response = await axios.post('https://bwipjs-api.barcode.studio/barcode', {
            bcid: 'code128', // Barcode type (change it to suit your needs)
            text: ean, // EAN (barcode number)
            scale: 3, // Scale factor for the barcode
            height: 10, // Height of the barcode in millimeters
            includetext: true, // Include the text below the barcode
            textxalign: 'center', // Text alignment
            padding: 10, // Padding around the barcode
        });

        // Return the base64 image
        return response.data.barcode_image;
    } catch (error) {
        console.error('Error generating barcode:', error);
        throw error;
    }
};

// Example usage
const barcodeBase64 = generateBarcodeBase64('1234567');

