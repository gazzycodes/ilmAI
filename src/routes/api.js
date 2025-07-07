const express = require('express');
const router = express.Router();
const { queryGemini } = require('../utils/geminiService');
const { buildPrompt, extractSources } = require('../utils/promptBuilder');
const logger = require('../utils/logger');

// Rate limiting variables
const requestCounts = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15;

/**
 * Simple rate limiting middleware
 */
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  
  // Initialize or clean up old requests
  if (!requestCounts[ip] || now - requestCounts[ip].timestamp > RATE_LIMIT_WINDOW) {
    requestCounts[ip] = {
      count: 0,
      timestamp: now
    };
  }
  
  // Check if rate limit exceeded
  if (requestCounts[ip].count >= MAX_REQUESTS_PER_MINUTE) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: 'Please try again later' 
    });
  }
  
  // Increment request count
  requestCounts[ip].count++;
  next();
}

/**
 * Route to handle user queries
 */
router.post('/query', rateLimiter, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      logger.warn('Invalid query received');
      return res.status(400).json({ error: 'Invalid query' });
    }
    
    logger.info(`Processing query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
    
    // Build the prompt for Gemini
    const { prompt, relevantVerses, relevantHadiths } = buildPrompt(query);
    logger.debug(`Built prompt with ${relevantVerses.length} verses and ${relevantHadiths.length} hadiths`);
    
    // Check if we have relevant content
    const hasRelevantContent = relevantVerses.length > 0 || relevantHadiths.length > 0;
    
    // Get response from Gemini
    logger.debug('Sending request to Gemini API');
    const response = await queryGemini(prompt);
    
    if (!response || !response.candidates || response.candidates.length === 0) {
      logger.error('Empty response from Gemini API');
      return res.status(500).json({ 
        error: 'Empty response from AI',
        message: 'The AI service returned an empty response'
      });
    }
    
    // Extract the text from the response
    const responseText = response.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      logger.error('No text in Gemini API response', response);
      return res.status(500).json({ 
        error: 'Invalid response format',
        message: 'The AI service returned a response in an unexpected format'
      });
    }
    
    // Extract sources from the relevant verses and hadiths
    const sources = extractSources(relevantVerses, relevantHadiths);
    
    logger.info('Query processed successfully');
    logger.debug('Response text:', responseText.substring(0, 100) + (responseText.length > 100 ? '...' : ''));
    
    res.json({ 
      response: responseText,
      query,
      sources,
      hasRelevantContent
    });
  } catch (error) {
    logger.error('API Error:', error.message);
    logger.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message
    });
  }
});

module.exports = router; 