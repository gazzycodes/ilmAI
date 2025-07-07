const axios = require('axios');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAeYLOEC29HIYE0lu-0yc7zi9BUkXAKOB4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Send a prompt to the Gemini API and get a response
 * @param {string} prompt - The user's query
 * @returns {Promise<Object>} - The AI response
 */
async function queryGemini(prompt) {
  try {
    logger.debug('Preparing request to Gemini API');
    logger.debug('Prompt length:', prompt.length);
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        stopSequences: []
      }
    };
    
    logger.debug('Request URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 5)}...`);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody
    );

    logger.debug('Received response from Gemini API');
    logger.debug('Response status:', response.status);
    
    if (!response.data) {
      throw new Error('Empty response data from Gemini API');
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error('Gemini API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(`Gemini API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('No response received from Gemini API:', error.request);
      throw new Error('No response received from Gemini API');
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('Error setting up Gemini API request:', error.message);
      throw new Error(`Failed to set up Gemini API request: ${error.message}`);
    }
  }
}

module.exports = { queryGemini }; 