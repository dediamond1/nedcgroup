// helper/translateText.js
import axios from 'axios';

const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post('https://translate.techdevcyber.se/translate', {
      q: text,
      source: 'en',
      target: targetLanguage,
      format: 'text',
    });

    return response.data.translatedText;
  } catch (error) {
    // Log more detailed error information
 
    throw new Error('Translation failed');
  }
};

export default translateText;
