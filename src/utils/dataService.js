const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Path to data files
const quranDataPath = path.join(__dirname, '../../data/quran.json');
const hadithDataPath = path.join(__dirname, '../../data/hadith.json');

// Load data from files
let quranData;
let hadithData;

try {
  logger.info('Loading data files...');
  quranData = JSON.parse(fs.readFileSync(quranDataPath, 'utf8'));
  hadithData = JSON.parse(fs.readFileSync(hadithDataPath, 'utf8'));
  logger.info(`Loaded ${quranData.verses.length} Quran verses and ${hadithData.hadiths.length} Hadiths`);
} catch (error) {
  logger.error('Error loading data files:', error);
  quranData = { verses: [] };
  hadithData = { hadiths: [] };
}

/**
 * Extract meaningful keywords from a query
 * @param {string} query - The search query
 * @returns {Array} - Array of keywords
 */
function extractKeywords(query) {
  // Common stopwords to filter out
  const stopwords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 
    'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 
    'out', 'of', 'from', 'up', 'down', 'is', 'am', 'are', 'was', 'were', 'be', 
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 
    'shall', 'should', 'may', 'might', 'must', 'can', 'could'
  ];

  // Clean and prepare the query
  return query.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .split(/\s+/)            // Split by whitespace
    .filter(word => word.length > 2 && !stopwords.includes(word)); // Filter out short words and stopwords
}

/**
 * Search for Quran verses by keywords
 * @param {string} query - The search query
 * @returns {Array} - Matching verses
 */
function searchQuran(query) {
  if (!query || !quranData.verses) return [];
  
  // Extract keywords from query
  const keywords = extractKeywords(query);
  
  // If no valid keywords after filtering, return empty array
  if (keywords.length === 0) return [];
  
  logger.debug(`Searching Quran for keywords: ${keywords.join(', ')}`);
  
  // Important concepts that might be in the query
  const importantConcepts = {
    'jesus': ['jesus', 'isa', 'christ', 'messiah'],
    'muhammad': ['muhammad', 'prophet', 'messenger'],
    'prayer': ['prayer', 'salah', 'salat', 'pray', 'worship'],
    'death': ['death', 'die', 'dead', 'crucify', 'crucified', 'crucifixion', 'killed', 'kill'],
    'life': ['life', 'live', 'alive', 'living', 'resurrection', 'raised'],
    'belief': ['belief', 'believe', 'faith', 'iman', 'islam', 'muslim'],
    'sin': ['sin', 'forgiveness', 'repent', 'repentance', 'forgive'],
    'heaven': ['heaven', 'paradise', 'jannah', 'hereafter'],
    'hell': ['hell', 'jahannam', 'fire', 'punishment'],
    'charity': ['charity', 'zakat', 'sadaqah', 'give', 'giving']
  };
  
  // Check if query contains important concepts
  const queryTopics = new Set();
  for (const [topic, relatedTerms] of Object.entries(importantConcepts)) {
    if (relatedTerms.some(term => query.toLowerCase().includes(term))) {
      queryTopics.add(topic);
    }
  }
  
  const results = quranData.verses.filter(verse => {
    const translationLower = verse.translation.toLowerCase();
    
    // Calculate a relevance score based on how many keywords match
    let matchCount = keywords.filter(keyword => translationLower.includes(keyword)).length;
    
    // Boost score for verses that match important concepts in the query
    queryTopics.forEach(topic => {
      if (importantConcepts[topic].some(term => translationLower.includes(term))) {
        matchCount += 2; // Give extra weight to conceptual matches
      }
    });
    
    // Add a relevance score to the verse
    if (matchCount > 0) {
      verse.relevance = matchCount / (keywords.length + queryTopics.size);
      return true;
    }
    return false;
  })
  // Sort by relevance score (highest first)
  .sort((a, b) => b.relevance - a.relevance);
  
  logger.debug(`Found ${results.length} matching Quran verses`);
  return results;
}

/**
 * Search for Hadith by keywords
 * @param {string} query - The search query
 * @returns {Array} - Matching hadiths
 */
function searchHadith(query) {
  if (!query || !hadithData.hadiths) return [];
  
  // Extract keywords from query
  const keywords = extractKeywords(query);
  
  // If no valid keywords after filtering, return empty array
  if (keywords.length === 0) return [];
  
  logger.debug(`Searching Hadith for keywords: ${keywords.join(', ')}`);
  
  // Important concepts that might be in the query
  const importantConcepts = {
    'jesus': ['jesus', 'isa', 'christ', 'messiah'],
    'muhammad': ['muhammad', 'prophet', 'messenger'],
    'prayer': ['prayer', 'salah', 'salat', 'pray', 'worship'],
    'death': ['death', 'die', 'dead', 'crucify', 'crucified', 'crucifixion', 'killed', 'kill'],
    'life': ['life', 'live', 'alive', 'living', 'resurrection', 'raised'],
    'belief': ['belief', 'believe', 'faith', 'iman', 'islam', 'muslim'],
    'sin': ['sin', 'forgiveness', 'repent', 'repentance', 'forgive'],
    'heaven': ['heaven', 'paradise', 'jannah', 'hereafter'],
    'hell': ['hell', 'jahannam', 'fire', 'punishment'],
    'charity': ['charity', 'zakat', 'sadaqah', 'give', 'giving']
  };
  
  // Check if query contains important concepts
  const queryTopics = new Set();
  for (const [topic, relatedTerms] of Object.entries(importantConcepts)) {
    if (relatedTerms.some(term => query.toLowerCase().includes(term))) {
      queryTopics.add(topic);
    }
  }
  
  // Check if hadith has topics field and use it for better matching
  const results = hadithData.hadiths.filter(hadith => {
    const textLower = hadith.text.toLowerCase();
    
    // Calculate a relevance score based on how many keywords match
    let matchCount = keywords.filter(keyword => textLower.includes(keyword)).length;
    
    // Boost score for hadiths that match important concepts in the query
    queryTopics.forEach(topic => {
      if (importantConcepts[topic].some(term => textLower.includes(term))) {
        matchCount += 2; // Give extra weight to conceptual matches
      }
      
      // Use hadith topics if available for even better matching
      if (hadith.topics && hadith.topics.includes(topic)) {
        matchCount += 3; // Give even more weight to topic matches
      }
    });
    
    // Add a relevance score to the hadith
    if (matchCount > 0) {
      hadith.relevance = matchCount / (keywords.length + queryTopics.size);
      return true;
    }
    return false;
  })
  // Sort by relevance score (highest first)
  .sort((a, b) => b.relevance - a.relevance);
  
  logger.debug(`Found ${results.length} matching Hadiths`);
  return results;
}

/**
 * Get a specific verse by surah and ayah numbers
 * @param {number} surah - Surah number
 * @param {number} ayah - Ayah number
 * @returns {Object|null} - The verse or null if not found
 */
function getVerse(surah, ayah) {
  if (!quranData.verses) return null;
  
  logger.debug(`Getting verse ${surah}:${ayah}`);
  return quranData.verses.find(verse => 
    verse.surah === Number(surah) && verse.ayah === Number(ayah)
  ) || null;
}

/**
 * Get a specific hadith by collection and number
 * @param {string} collection - Hadith collection name
 * @param {string} number - Hadith number
 * @returns {Object|null} - The hadith or null if not found
 */
function getHadith(collection, number) {
  if (!hadithData.hadiths) return null;
  
  logger.debug(`Getting hadith ${collection} ${number}`);
  return hadithData.hadiths.find(hadith => 
    hadith.collection === collection && hadith.number === number
  ) || null;
}

module.exports = {
  searchQuran,
  searchHadith,
  getVerse,
  getHadith
}; 